// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder to create fancy embedded messages, and Colors for color options
const { EmbedBuilder, Colors } = require('discord.js');
// Import the shared response arrays — Node.js caches this after the first require(),
// so the data is only loaded once at startup, not on every command call
const { eightball } = require('../../data/responses');

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask a question and let 8ball decide the answer')
        // Add a required text option where the user types their question
        .addStringOption(option => option.setName('question').setDescription('Enter a question').setRequired(true)),

    async execute(interaction) {
        // Pick a random response from the pre-loaded array
        const randomMessage = eightball[Math.floor(Math.random() * eightball.length)];
        // Get the question the user typed in the slash command
        const question = interaction.options.getString('question');

        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            .setFooter({ text: `Requested by ${interaction.user.tag}` }) // Show who asked
            .setTimestamp()
            .setTitle('🎱 ' + question) // Show the question as the embed title
            .setDescription(randomMessage); // Show the random 8ball answer

        // Send the embed as a reply to the user
        await interaction.reply({ embeds: [embed] });
    }
};