// Import SlashCommandBuilder to create a slash command and EmbedBuilder for fancy messages
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// 'fs' lets us read and write files and folders on the computer
const fs = require('fs');
// 'path' helps us build file paths that work on any operating system
const path = require('path');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Lists all available bot commands'),

    async execute(interaction) {
        // Build the path to the slashCommands folder (goes up 2 levels from this file)
        const commandsDir = path.join(__dirname, '../../slashCommands'); // Go up 2 levels to find 'slashCommands'
        // Read all folder names inside the slashCommands directory
        const folders = fs.readdirSync(commandsDir);

        // Create the embed that will display all the commands
        const embed = new EmbedBuilder()
            .setTitle('📜 Command List')
            .setDescription('Here are all the available commands categorized by folder:')
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            // Show the bot's own avatar as a thumbnail in the top-right of the embed
            .setThumbnail(interaction.client.user.displayAvatarURL())
            // Show who requested the command in the footer
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Loop through each folder (fun, info, utility, etc.)
        for (const folder of folders) {
            // Build the full path to this specific folder
            const folderPath = path.join(commandsDir, folder);
            
            // Make sure it's a folder and not a file
            if (fs.statSync(folderPath).isDirectory()) {
                // Get all .js files inside this folder — each file is one command
                const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
                
                // If the folder has commands, add a field to the embed
                if (files.length > 0) {
                    // Remove ".js" from filenames to get just the command names
                    const commandNames = files.map(file => `\`/${file.replace('.js', '')}\``);
                    
                    // Capitalize the folder name (e.g., "fun" -> "Fun")
                    const categoryName = folder.charAt(0).toUpperCase() + folder.slice(1);

                    // Add a new field to the embed for this category, showing all its commands
                    embed.addFields({
                        name: `${categoryName} (${files.length})`, // Category name + number of commands
                        value: commandNames.join(', '), // List all command names separated by commas
                        inline: false
                    });
                }
            }
        }

        // Send the completed embed as a reply
        await interaction.reply({ embeds: [embed] });
    }
};