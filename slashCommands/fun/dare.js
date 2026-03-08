// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder and Colors from discord.js (available for use if needed)
const { EmbedBuilder, Colors } = require('discord.js');
// Import the shared response arrays — Node.js caches this after the first require(),
// so the data is only loaded once at startup, not on every command call
const { dares } = require('../../data/responses');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('dare')
        .setDescription('Sends a random dare question'),

    async execute(interaction) {
        // Pick a random dare from the pre-loaded array
        const randomMessage = dares[Math.floor(Math.random() * dares.length)];

        // Send the random dare as a bold reply to the user
        await interaction.reply(`**${randomMessage}**`);
    }
};