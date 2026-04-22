// Import SlashCommandBuilder for the slash command and PermissionFlagsBits to check user permissions
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set the slowmode delay for the current channel. Use 0 to disable.')
        // Add a required integer option for the delay in seconds (0 = off, max Discord allows is 21600 = 6 hours)
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Slowmode delay in seconds (0 to disable, max 21600)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)),

    async execute(interaction) {
        // Check if the user has the Manage Channels permission before allowing them to use this command
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: 'You need the **Manage Channels** permission to use this command.'
            });
        }

        // Get the slowmode delay the user provided
        const seconds = interaction.options.getInteger('seconds');

        try {
            // Apply the slowmode to the current channel
            await interaction.channel.setRateLimitPerUser(seconds);

            // Confirm success with a different message depending on whether slowmode was disabled or set
            if (seconds === 0) {
                await interaction.reply('Slowmode has been **disabled** for this channel.');
            } else {
                // Format the delay nicely (e.g. "90 seconds" → "1 minute 30 seconds")
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                const parts = [];
                if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
                if (remainingSeconds > 0) parts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);

                await interaction.reply(`Slowmode set to **${parts.join(' ')}** for this channel.`);
            }
        } catch (error) {
            // If something goes wrong (e.g. missing bot permissions), log it and notify the user
            console.error('[slowmode] Error:', error);
            await interaction.reply({
                content: 'Failed to set slowmode. Make sure I have the **Manage Channels** permission.',
                ephemeral: true,
            });
        }
    },
};