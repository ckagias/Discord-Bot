// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('discord.js');
// Import the AFK schema to store and remove AFK entries in the database
const AfkSchema = require('../../models/AfkSchema');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set your AFK status. The bot will notify people who mention you.')
        // Add an optional reason option — if omitted, defaults to 'No reason provided'
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Why are you going AFK? (optional)')
                .setRequired(false)),

    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the user already has an active AFK entry in this server
        const existing = await AfkSchema.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
        });

        if (existing) {
            // If they're already AFK, remove the status (acts as a toggle to return from AFK)
            await AfkSchema.deleteOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            return interaction.reply({
                content: `✅ Welcome back, ${interaction.user}! Your AFK status has been removed.`,
                allowedMentions: { users: [] }, // Don't actually ping them
            });
        }

        // Save the AFK entry to the database with the provided reason and current timestamp
        await AfkSchema.create({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            reason,
            since: new Date(),
        });

        // Confirm to the user that their AFK status has been set
        await interaction.reply({
            content: `🌙 You are now AFK: **${reason}**`,
            allowedMentions: { users: [] },
        });
    },
};