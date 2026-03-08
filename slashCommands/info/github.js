// 'axios' is a library used to make HTTP requests (like fetching data from an API)
const axios = require('axios');
// Import the necessary discord.js tools
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Shows GitHub statistics for a user.')
        // Add a required text option where the user types a GitHub username
        .addStringOption(option =>
            option.setName('username')
                .setDescription('GitHub username (e.g., octocat)')
                .setRequired(true)),

    async execute(interaction) {
        const username = interaction.options.getString('username');

        // Defer the reply so we have time to fetch data without Discord timing out
        await interaction.deferReply();

        try {
            // Fetch the user's profile from the GitHub REST API
            const userRes = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'User-Agent': 'Discord-Bot',
                    // Use a GitHub token if provided, to avoid rate limiting
                    ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
                }
            });

            const user = userRes.data;

            // Fetch the user's public repositories to calculate total stars
            const reposRes = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'User-Agent': 'Discord-Bot',
                    ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
                }
            });

            const repos = reposRes.data;

            // Sum up stars across all public repositories
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

            // Find the most starred repository
            const topRepo = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];

            // Format the account creation date nicely
            const createdAt = new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Build the embed
            const embed = new EmbedBuilder()
                .setTitle(`${user.login}`)
                .setURL(user.html_url)
                .setThumbnail(user.avatar_url)
                .setColor(0x24292e) // GitHub's dark background color
                .setDescription(user.bio ? `*${user.bio}*` : null);

            // Core stats field
            embed.addFields(
                {
                    name: '📊 Profile Stats',
                    value: [
                        `👥 **Followers:** ${user.followers.toLocaleString()}`,
                        `👣 **Following:** ${user.following.toLocaleString()}`,
                        `📁 **Public Repos:** ${user.public_repos.toLocaleString()}`,
                        `🔧 **Public Gists:** ${user.public_gists.toLocaleString()}`,
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: '⭐ Repository Stats',
                    value: [
                        `⭐ **Total Stars:** ${totalStars.toLocaleString()}`,
                        topRepo
                            ? `🏆 **Top Repo:** [${topRepo.name}](${topRepo.html_url}) (${topRepo.stargazers_count} ⭐)`
                            : `🏆 **Top Repo:** N/A`,
                    ].join('\n'),
                    inline: true,
                }
            );

            // Optional fields — only show if the data exists
            const optionalLines = [];
            if (user.name) optionalLines.push(`📛 **Name:** ${user.name}`);
            if (user.company) optionalLines.push(`🏢 **Company:** ${user.company}`);
            if (user.location) optionalLines.push(`📍 **Location:** ${user.location}`);
            if (user.blog) optionalLines.push(`🔗 **Website:** [${user.blog}](${user.blog.startsWith('http') ? user.blog : `https://${user.blog}`})`);
            if (user.twitter_username) optionalLines.push(`🐦 **Twitter:** [@${user.twitter_username}](https://twitter.com/${user.twitter_username})`);

            if (optionalLines.length > 0) {
                embed.addFields({ name: '📌 Details', value: optionalLines.join('\n'), inline: false });
            }

            embed
                .addFields({ name: '📅 Member Since', value: createdAt, inline: false })
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            // Handle 404 (user not found) separately from other errors
            if (err.response?.status === 404) {
                await interaction.editReply(`❌ GitHub user **${username}** was not found.`);
            } else if (err.response?.status === 403) {
                await interaction.editReply('❌ GitHub API rate limit exceeded. Please try again later.');
            } else {
                console.error('GitHub command error:', err);
                await interaction.editReply('❌ An error occurred while fetching GitHub data.');
            }
        }
    }
};
