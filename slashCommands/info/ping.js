// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder for fancy messages and Colors for preset color options
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the bot latency and API ping.'),

    async execute(interaction) {
        
        const client = interaction.client;
        // API Latency is the ping between the bot and Discord's servers (in milliseconds)
        const apiLatency = Math.round(client.ws.ping);
        // Bot Latency is how long it took from the user sending the command to the bot receiving it
        const botLatency = Math.round(Date.now() - interaction.createdTimestamp);

        let embed = new EmbedBuilder()
            .setTitle('🏓 | Pong!')
            .setColor(Colors.Green) // Use a preset green color from discord.js
            .addFields(
                { name: 'API Latency', value: `\`${apiLatency} ms\`` }, // Ping to Discord's servers
                { name: 'Bot Latency', value: `\`${botLatency} ms\`` }  // Time for the bot to respond
            )
            .setTimestamp();

        // Send the embed as a reply
        await interaction.reply({embeds: [embed]});
    }
};