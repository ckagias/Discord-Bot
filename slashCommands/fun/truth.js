// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder and Colors from discord.js (available for use if needed)
const { EmbedBuilder, Colors } = require('discord.js');
// Import the shared response arrays — Node.js caches this after the first require(),
// so the data is only loaded once at startup, not on every command call
const { truths } = require('../../data/responses');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('truth')
        .setDescription('Sends a random truth question'),

    async execute(interaction) {
        // Pick a random truth question from the pre-loaded array
        const randomMessage = truths[Math.floor(Math.random() * truths.length)];

        // Send the random truth question as a bold reply to the user
        await interaction.reply(`**${randomMessage}**`);
    }
};