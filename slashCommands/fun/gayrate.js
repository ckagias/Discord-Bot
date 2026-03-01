// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder to create fancy embedded messages, and Colors for color options
const { EmbedBuilder, Colors} = require('discord.js');

module.exports = {
	// Define the slash command's name and description
	data: new SlashCommandBuilder()
		.setName('gayrate')
		.setDescription('Shows how gay someone is')
		// Add an optional user option — if no user is selected, it will default to the person who used the command
    	.addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user you want to rate')
                .setRequired(false)),
  
	async execute(interaction) {

        const client = interaction.client;
        // Get the selected user, or fall back to the person who used the command if no one was picked
        let user = interaction.options.getUser("user") || interaction.user;
        // Generate a random percentage between 0 and 100
        const gayrate = Math.floor(Math.random() * 101)

        if(user === interaction.user) {
        let embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            .setTitle("Gayrate 🏳️‍🌈")
            .setDescription(`**${user} you are ${gayrate}% gay :rainbow_flag:**`)
            .setTimestamp()
        
            // Send the embed as a reply
            await interaction.reply({ embeds: [embed] });
        }
        // If a different user was selected, use "is" in the message instead
        else {
            let embed = new EmbedBuilder()
                .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
                .setTitle("Gayrate 🏳️‍🌈")
                .setDescription(`**${user} is ${gayrate}% gay :rainbow_flag:**`)
                .setTimestamp()

            // Send the embed as a reply
            await interaction.reply({ embeds: [embed] });
        }
	}
};