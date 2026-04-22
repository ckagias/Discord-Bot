// Import SlashCommandBuilder to create a slash command
// Import EmbedBuilder to create fancy embedded messages
// Import PermissionFlagsBits to restrict the command to administrators only
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// Import mongoose to access the active database connection and run queries
const mongoose = require('mongoose');

module.exports = {
    // Define the slash command's name, description, and permission requirements
    data: new SlashCommandBuilder()
        .setName('database')
        .setDescription('Shows the current size and statistics of the MongoDB database.')
        // Restrict to admins so regular users can't spam database queries
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Defer the reply in case the database takes a second to respond
        await interaction.deferReply({ ephemeral: false });

        try {
            // Check if Mongoose is actually connected before attempting any queries
            if (mongoose.connection.readyState !== 1) {
                return interaction.editReply('The bot is not currently connected to the database.');
            }

            // Fetch raw statistics directly from MongoDB
            const stats = await mongoose.connection.db.stats();

            // MongoDB returns sizes in bytes — convert to MB for readability (1 MB = 1024 * 1024 bytes)
            const dataSizeMB = (stats.dataSize / (1024 * 1024)).toFixed(2);
            const storageSizeMB = (stats.storageSize / (1024 * 1024)).toFixed(2);

            // Build a nice looking embed to display the stats
            const embed = new EmbedBuilder()
                .setTitle('📊 Database Storage Stats')
                .setColor('Green')
                .addFields(
                    { name: '🗄️ Database Name', value: `\`${stats.db}\``, inline: true },
                    { name: '📁 Collections', value: `\`${stats.collections}\``, inline: true },
                    { name: '📄 Total Documents', value: `\`${stats.objects}\``, inline: true },

                    // dataSize is the actual size of the raw stored data
                    { name: '💾 Raw Data Size', value: `\`${dataSizeMB} MB\``, inline: true },

                    // storageSize is how much physical disk space MongoDB has allocated on disk
                    { name: '💽 Disk Storage Used', value: `\`${storageSizeMB} MB\``, inline: true }
                )
                .setFooter({ text: 'MongoDB' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            // Log the full error server-side and send a clean message to the admin
            console.error('Error fetching database stats:', error);
            await interaction.editReply('An error occurred while fetching database statistics.');
        }
    },
};