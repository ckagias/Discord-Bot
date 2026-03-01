// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder for fancy messages and Colors for color options
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
	// Define the slash command's name and description
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription("Shows bot's uptime"),
  
	async execute(interaction) {
        // Get the bot client from the interaction
        const client = interaction.client;
        // Convert the bot's uptime (in milliseconds) into days, hours, minutes, and seconds
        let seconds = Math.floor(client.uptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        // Use module (%) to get the reminder so each unit doesn't overflow into the next e.g. 90 seconds becomes 1 minute and 30 seconds, not "90 seconds"
        seconds %= 60;
        minutes %= 60;
        hours %= 24;
    
        const embed  = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
        .setTitle('Kafeneios Eros Uptime 📈')
        // Display the uptime in a readable format
        .setDescription(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`)
    
        // Send the embed as a reply
        await interaction.reply({embeds: [embed] })

	}
};