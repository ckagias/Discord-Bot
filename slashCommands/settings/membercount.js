// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder for fancy messages and Colors for preset color options
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Returns current members of this server'),
        
    async execute(interaction) {
        // Get the server (guild) where the command was used
        const guild = interaction.guild;
        // Get the total number of members in the server
        const memberCount = guild.memberCount;

        const embed = new EmbedBuilder()
            .setTitle(`👥 Members in ${guild.name}`)
            .setColor(Colors.Blue) // Use a preset blue color from discord.js
            .setDescription(`This server has **${memberCount} members**.`)
            // Show the server's icon as a thumbnail in the top-right of the embed
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp();

        // Send the embed as a reply
        await interaction.reply({ embeds: [embed] });
    }
};