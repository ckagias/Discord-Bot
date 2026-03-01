// Import SlashCommandBuilder for the slash command and PermissionFlagsBits to check user permissions
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes a specific number of messages.')
    // Add a required integer option with a minimum of 1 and maximum of 100
    .addIntegerOption(option => 
        option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),

    async execute(interaction) {

        // Check if the user has the "Manage Messages" permission before allowing them to use this command and if they don't, send an ephemeral
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ 
                content: "❌ You do not have permission to delete messages!", 
                ephemeral: true // Only the user who ran the command can see this message
            });
        }

        // Get the number of messages the user wants to delete
        const amount = interaction.options.getInteger('amount');

        try {
            // Bulk delete the specified number of messages in the current channel
            // The second argument 'true' filters out messages older than 14 days (Discord's bulk delete limit)
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);

            // Reply with how many messages were actually deleted (may be less than requested if some were too old)
            await interaction.reply({content: `🧹 Successfully deleted **${deletedMessages.size}** messages!`});
        } catch(error) {
            // Discord does not allow bulk deleting messages older than 14 days
            // This catch block handles that case as well as any missing permission errors
            console.error(error);
            await interaction.reply({content: '❌ I cannot delete messages that are older than 14 days or I lack permissions.'});
        }
    }
}