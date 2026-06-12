const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Shows GitHub statistics for a user.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('GitHub username (e.g., octocat)')
                .setRequired(true)),

    async execute(interaction) {
        const username = interaction.options.getString('username');
        await interaction.deferReply();

        try {
            const headers = {
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'Discord-Bot',
                ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
            };

            const [userRes, reposRes] = await Promise.all([
                axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
                axios.get(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { headers }),
            ]);

            const user = userRes.data;
            const repos = reposRes.data;
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            const topRepo = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
            const createdAt = new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const embed = new EmbedBuilder()
                .setTitle(user.login)
                .setURL(user.html_url)
                .setThumbnail(user.avatar_url)
                .setColor(0x24292e)
                .setDescription(user.bio ? `*${user.bio}*` : null);

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
            if (err.response?.status === 404) {
                await interaction.editReply(`GitHub user **${username}** was not found.`);
            } else if (err.response?.status === 403) {
                await interaction.editReply('GitHub API rate limit exceeded. Please try again later.');
            } else {
                console.error('[github] Error:', err);
                await interaction.editReply('An error occurred while fetching GitHub data.');
            }
        }
    }
};