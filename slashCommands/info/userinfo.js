// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('discord.js');
// Import EmbedBuilder to create fancy embedded messages
const { EmbedBuilder } = require('discord.js');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription("Shows detailed information about a user.")
        // Add an optional user option — defaults to the person who used the command
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to look up')
                .setRequired(false)),

    async execute(interaction) {
        // Get the selected user, or fall back to the person who used the command
        const user = interaction.options.getUser('user') || interaction.user;
        // Fetch the full user object to get banner and accent colour data
        const fetchedUser = await user.fetch();
        // Get the guild member to access server-specific info like roles and join date
        const member = interaction.guild?.members.cache.get(user.id);

        // Format the account creation date
        const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`;
        // Format the server join date (only available if they're in this server)
        const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'N/A';

        // Get all roles the member has, excluding the default @everyone role, sorted by position (highest first)
        const roles = member
            ? member.roles.cache
                .filter(r => r.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(r => `${r}`)
                .join(', ') || 'None'
            : 'N/A';

        // Determine if the user has any special flags (e.g. Discord Staff, Bug Hunter, etc.)
        const flags = fetchedUser.flags?.toArray();
        const badges = flags?.length
            ? flags.map(f => f.replace(/_/g, ' ')).join(', ')
            : 'None';

        const embed = new EmbedBuilder()
            .setColor(fetchedUser.accentColor ?? Math.floor(Math.random() * 0xFFFFFF)) // Use profile accent color if available
            .setTitle(`${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                // Core user info
                { name: '🆔 User ID', value: user.id, inline: true },
                { name: '🤖 Bot', value: user.bot ? '✅' : '❌', inline: true },
                { name: '📅 Account Created', value: createdAt, inline: true },
                // Server-specific info
                { name: '📥 Joined Server', value: joinedAt, inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: '🏅 Badges', value: badges, inline: true },
                // Roles — shown on their own line since the list can be long
                { name: `🎭 Roles [${member?.roles.cache.size - 1 || 0}]`, value: roles, inline: false },
            )
            // Show who requested the command in the footer
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // If the user has a profile banner, show it at the bottom of the embed
        if (fetchedUser.banner) {
            embed.setImage(fetchedUser.bannerURL({ size: 1024 }));
        }

        // Send the embed as a reply
        await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
};
