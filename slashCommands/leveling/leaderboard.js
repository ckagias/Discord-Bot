// Import SlashCommandBuilder to create a slash command
// Import EmbedBuilder to create fancy embedded messages
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Import LevelSchema to fetch user XP and level data from the database
const LevelSchema = require('../../models/LevelSchema');

// Medal emojis for the top 3 spots
const MEDALS = ['🥇', '🥈', '🥉'];

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the top 10 most-leveled members in this server.'),

    async execute(interaction) {
        // Defer the reply while we fetch and resolve data — Discord requires a response within 3 seconds
        await interaction.deferReply();

        const { guild } = interaction;

        // Fetch the top 10 users in this server, sorted by level then XP as a tiebreaker
        const topUsers = await LevelSchema
            .find({ guildId: guild.id })
            .sort({ level: -1, xp: -1 })
            .limit(10);

        // If nobody has earned XP yet, send a helpful prompt instead of an empty embed
        if (!topUsers.length) {
            return interaction.editReply({
                content: `No one in **${guild.name}** has earned any XP yet. Start chatting!`,
            });
        }

        // Build each leaderboard line, resolving display names from the guild where possible
        const lines = await Promise.all(
            topUsers.map(async (entry, index) => {
                // Use a medal emoji for top 3, otherwise show a bold rank number
                const rank = MEDALS[index] ?? `**#${index + 1}**`;

                // Try to resolve the member's display name — fall back to their ID if they've left the server
                let displayName;
                try {
                    const member = await guild.members.fetch(entry.userId);
                    displayName = member.displayName;
                } catch {
                    displayName = `Unknown User (${entry.userId})`;
                }

                // Calculate the XP needed for the next level to show alongside current progress
                const xpNeeded = 100 * Math.pow(entry.level + 1, 2);
                return `${rank} **${displayName}** — Level ${entry.level} (${entry.xp}/${xpNeeded} XP)`;
            })
        );

        let embed = new EmbedBuilder()
            .setTitle(`🏆 ${guild.name} Leaderboard`)
            .setThumbnail(guild.iconURL({ dynamic: true })) // 'dynamic: true' renders animated server icons as GIFs
            .setColor(0xFFD700) // Gold
            .setDescription(lines.join('\n'))
            .setFooter({ text: 'Top 10 by Level • Ties broken by current XP' })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },
};