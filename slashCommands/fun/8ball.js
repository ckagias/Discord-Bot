// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder to create fancy embedded messages, and Colors for color options
const { EmbedBuilder, Colors } = require('discord.js');
// 'fs' lets us read and write files on the computer
const fs = require('fs');
// 'path' helps us build file paths that work on any operating system
const path = require('path');

module.exports = {
	// Define the slash command's name, description, and options
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask a question and let 8ball decide the answer')
		// Add a required text option where the user types their question
		.addStringOption(option => option.setName('question').setDescription('Enter a question').setRequired(true)),
	
  	async execute(interaction) {
    	try {

      		// Build the full file path to the 8ball.txt responses file
      		const filePath = path.join(__dirname, '..', '..', '/texts/8ball.txt');
      		// Read the entire file content as a plain text string
      		const fileContent = fs.readFileSync(filePath, 'utf8');

      		const client = interaction.client;
      		// Split the file into individual lines, trim extra spaces, and remove any empty lines — each line is one possible response
      		const messages = fileContent
        		.split('\n')
        		.map(line => line.trim())
        		.filter(line => line.length > 0);

      		// Pick a random response from the list
      		const randomMessage = messages[Math.floor(Math.random() * messages.length)]; 
			// Get the question the user typed in the slash command
			const question = interaction.options.getString('question');

			const embed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            	.setFooter({text:`Requested by ${interaction.user.tag}`}) // Show who asked
            	.setTimestamp()
				.setTitle('🎱 ' + question) // Show the question as the embed title
				.setDescription(randomMessage) // Show the random 8ball answer
				.setTimestamp();

        	// Send the embed as a reply to the user
        	await interaction.reply({ embeds: [embed] });

    	} catch (error) {
      		// If something goes wrong, log the error and notify the user
      		console.error(error);
      		await interaction.reply("❌ Δεν μπόρεσα να διαβάσω το αρχείο 8ball.txt!");
    	}
	}
};