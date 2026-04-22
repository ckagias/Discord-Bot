// Import SlashCommandBuilder to create a slash command
// Import PermissionFlagsBits to restrict the command to administrators only
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// Import GuildSchema to read and update the server's leveling setting in the database
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    // Define the slash command's name, description, and permission requirements
    data: new SlashCommandBuilder()
        .setName('toggleleveling')
        .setDescription('Enable or disable the XP leveling system for this server.')
        // Restrict this command so only server administrators can see and use it
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Defer the reply as ephemeral (only visible to the admin) while we query the database
        await interaction.deferReply({ ephemeral: true });

        const { guild } = interaction;

        // Fetch the server's settings, creating a new document with defaults if one doesn't exist yet
        let guildData = await GuildSchema.findOneAndUpdate(
            { guildId: guild.id },
            { $setOnInsert: { guildId: guild.id } },
            { upsert: true, returnDocument: true }
        );

        // Flip the current leveling setting and save it back to the database
        guildData.levelingEnabled = !guildData.levelingEnabled;
        await guildData.save();

        // Build a status string to confirm the new state to the admin
        const status = guildData.levelingEnabled ? '**Enabled**' : '**Disabled**';

        return interaction.editReply({
            content: `The leveling system is now ${status} for **${guild.name}**.`,
        });
    },
};