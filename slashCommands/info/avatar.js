// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder to create fancy embedded messages, and Colors for color options
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
	// Define the slash command's name and description
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription("Shows the target's avatar")
		// Add an optional user option — if no user is selected, it will default to the person who used the command
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user you want to show the avatar for')
                .setRequired(false)),

	async execute(interaction) {

        const client = interaction.client;

        // Get the selected user, or fall back to the person who used the command if no one was picked
        let user = interaction.options.getUser("user") || interaction.user;

        let embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            .setTitle("Avatar")
            .setTimestamp()
            // Show the target user's tag and avatar in the author section of the embed
            .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}`})
            // Show who requested the command in the footer
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            // Provide download links for the avatar in png, jpg, and webp formats at high resolution
            .setDescription(`[png](${user.displayAvatarURL({ size: 2048, dynamic: true, format: "png"})}) | [jpg](${user.displayAvatarURL({ size: 2048, dynamic: true, format: "jpg"})}) | [webp](${user.displayAvatarURL({ size: 2048, dynamic: true, format: "webp"})})`)
            // Display the avatar as a large image inside the embed (up to 4096px)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));

        // Send the embed as a reply — allowedMentions prevents pinging the replied user
        await  interaction. reply({ embeds: [embed], allowedMentions: { repliedUser: false }});
	}
};