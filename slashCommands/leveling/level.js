// Import SlashCommandBuilder to create a slash command
// Import EmbedBuilder to create fancy embedded messages
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Import LevelSchema to fetch the target user's XP and level data from the database
const LevelSchema = require('../../models/LevelSchema');

module.exports = {
    // Define the slash command's name, description, and optional user argument
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription("Check your (or another user's) current level and XP progress.")
        // Add an optional user option — if no user is selected, it will default to the person who used the command
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to look up (leave blank to check yourself)')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Defer the reply while we query the database — Discord requires a response within 3 seconds
        await interaction.deferReply();

        // Get the selected user, or fall back to the person who used the command if no one was picked
        const target = interaction.options.getUser('user') ?? interaction.user;
        const { guild } = interaction;

        // Look up the target's level data for this specific server
        const userData = await LevelSchema.findOne({
            userId: target.id,
            guildId: guild.id,
        });

        // If no data exists, the user hasn't earned any XP yet
        if (!userData || userData.xp === 0 && userData.level === 0) {
            return interaction.editReply({
                content: `${target} hasn't earned any XP in **${guild.name}** yet!`,
            });
        }

        // Calculate how much XP is needed to reach the next level
        const xpNeeded = 100 * Math.pow(userData.level + 1, 2);

        // Build a visual progress bar 20 segments wide
        const progress = Math.min(userData.xp / xpNeeded, 1); // Cap at 1.0 so the bar never overflows
        const filledBars = Math.round(progress * 20);
        const emptyBars = 20 - filledBars;
        const progressBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

        let embed = new EmbedBuilder()
            .setTitle(`${target.username}'s Level`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true })) // 'dynamic: true' renders animated avatars as GIFs
            .setColor(0x5865F2) // Blurple
            .addFields(
                { name: '🏆 Level', value: `${userData.level}`, inline: true },
                { name: '✨ XP', value: `${userData.xp} / ${xpNeeded}`, inline: true },
                // Wrap the bar in backticks so it renders in monospace and stays evenly spaced
                { name: '📊 Progress', value: `\`${progressBar}\` ${Math.round(progress * 100)}%` }
            )
            .setFooter({ text: guild.name, iconURL: guild.iconURL() })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    },
};