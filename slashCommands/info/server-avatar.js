// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('@discordjs/builders');
// Import EmbedBuilder for fancy messages and Colors for color options
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
	.setName('server-avatar')
	.setDescription("Shows the target's server avatar")
        // Add a required user option — the user must select someone to run this command
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user you want to show the avatar for')
                .setRequired(true)),
                
     async execute(interaction) {

        const client = interaction.client;

        // Get the user that was selected in the slash command
        let user = interaction.options.getUser("user");

        // Get the member object from the server's cache using the user's ID 'member' has server-specific info like their server avatar, unlike 'user' which is global
        const member = interaction.guild.members.cache.get(user.id);

        let embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            .setTitle("Avatar")
            .setTimestamp()
            // Show the target user's tag and global avatar in the author section
            .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}`})
            // Show who requested the command in the footer
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            // Provide download links for the server avatar in png, jpg, and webp formats at high resolution
            // Note: uses 'member' instead of 'user' to get the server-specific avatar
            .setDescription(`[png](${member.displayAvatarURL({ size: 2048, dynamic: true, format: "png"})}) | [jpg](${member.displayAvatarURL({ size: 2048, dynamic: true, format: "jpg"})}) | [webp](${member.displayAvatarURL({ size: 2048, dynamic: true, format: "webp"})})`)
            // Display the server avatar as a large image inside the embed (up to 4096px)
            .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }))
    
        // Send the embed as a reply — allowedMentions prevents pinging the replied user
        await interaction. reply({ embeds: [embed], allowedMentions: { repliedUser: false }});
	}
};