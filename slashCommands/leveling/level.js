const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const LevelSchema = require('../../models/LevelSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription("Check your (or another user's) current level and XP progress.")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to look up (leave blank to check yourself)')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();

        const target = interaction.options.getUser('user') ?? interaction.user;
        const { guild } = interaction;

        const userData = await LevelSchema.findOne({ userId: target.id, guildId: guild.id });

        if (!userData || userData.xp === 0 && userData.level === 0) {
            return interaction.editReply({
                content: `${target} hasn't earned any XP in **${guild.name}** yet!`,
            });
        }

        const xpNeeded = 100 * Math.pow(userData.level + 1, 2);
        const progress = Math.min(userData.xp / xpNeeded, 1);
        const filledBars = Math.round(progress * 20);
        const progressBar = '█'.repeat(filledBars) + '░'.repeat(20 - filledBars);

        const embed = new EmbedBuilder()
            .setTitle(`${target.username}'s Level`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setColor(0x5865F2)
            .addFields(
                { name: '🏆 Level', value: `${userData.level}`, inline: true },
                { name: '✨ XP', value: `${userData.xp} / ${xpNeeded}`, inline: true },
                // Monospace backticks keep the bar evenly spaced
                { name: '📊 Progress', value: `\`${progressBar}\` ${Math.round(progress * 100)}%` }
            )
            .setFooter({ text: guild.name, iconURL: guild.iconURL() })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },
};