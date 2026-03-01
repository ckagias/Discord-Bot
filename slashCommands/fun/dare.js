// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder and Colors from discord.js (available for use if needed)
const { EmbedBuilder, Colors } = require('discord.js');
// 'fs' lets us read and write files on the computer
const fs = require('fs');
// 'path' helps us build file paths that work on any operating system
const path = require('path');

module.exports = {
	// Define the slash command's name and description
	data: new SlashCommandBuilder()
		.setName('dare')
		.setDescription('Sends a random dare question'),
	
    async execute(interaction) {
        try {

        // Build the full file path to the dares.txt file
        const filePath = path.join(__dirname, '..', '..', '/texts/dares.txt');
        // Read the entire file content as a plain text string
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const client = interaction.client;
        // Split the file into individual lines, trim extra spaces, and remove any empty lines — each line is one possible dare
        const messages = fileContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // Pick a random dare from the list
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]; 

        // Send the random dare as a bold reply to the user
        await interaction.reply(`**${randomMessage}**`);

    } catch (error) {
            // If something goes wrong, log the error and notify the user
            console.error(error);
            await interaction.reply("❌ Δεν μπόρεσα να διαβάσω το αρχείο dares.txt!");
        }
    }
};