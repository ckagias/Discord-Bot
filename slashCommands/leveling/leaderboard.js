const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const LevelSchema = require('../../models/LevelSchema');
const { getGuildConfig } = require('../../utils/guildConfig');

const MEDALS = ['🥇', '🥈', '🥉'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the top 10 most-leveled members in this server.'),

    async execute(interaction) {
        await interaction.deferReply();

        const { guild } = interaction;

        const guildData = await getGuildConfig(guild.id);
        if (!guildData?.levelingEnabled) {
            return interaction.editReply({ content: 'Leveling is not enabled on this server.' });
        }

        const topUsers = await LevelSchema
            .find({ guildId: guild.id })
            .sort({ level: -1, xp: -1 })
            .limit(10);

        if (!topUsers.length) {
            return interaction.editReply({
                content: `No one in **${guild.name}** has earned any XP yet. Start chatting!`,
            });
        }

        // Bulk-fetch all top members in a single API call instead of one per entry.
        const userIds = topUsers.map(u => u.userId);
        const members = await guild.members.fetch({ user: userIds }).catch(() => null);

        const lines = topUsers.map((entry, index) => {
            const rank = MEDALS[index] ?? `**#${index + 1}**`;
            const member = members?.get(entry.userId);
            const displayName = member ? member.displayName : `Unknown User (${entry.userId})`;
            const xpNeeded = 100 * Math.pow(entry.level + 1, 2);
            return `${rank} **${displayName}** — Level ${entry.level} (${entry.xp}/${xpNeeded} XP)`;
        });

        const embed = new EmbedBuilder()
            .setTitle(`🏆 ${guild.name} Leaderboard`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor(0xFFD700)
            .setDescription(lines.join('\n'))
            .setFooter({ text: 'Top 10 by Level • Ties broken by current XP' })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },
};