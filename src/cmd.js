// REST and Routes are used to communicate with Discord's API to register slash commands
const { REST, Routes } = require('discord.js');
// 'fs' lets us read files and folders on the computer
const fs = require('fs');
// 'path' helps us build file paths that work on any operating system
const path = require('path');
// 'dotenv' loads secret values (like the bot token) from a .env file into process.env
require('dotenv').config();

// This array will hold all the slash command data to be sent to Discord
const commands = [];

// Build the path to the slashCommands folder
const slashCommandsDir = path.join(__dirname, '..', 'slashCommands');
// Read all folder names inside the slashCommands directory (e.g. fun, info, utility)
const folders = fs.readdirSync(slashCommandsDir);

// Loop through each category folder
for (const folder of folders) {
    // Build the full path to this specific folder
    const folderPath = path.join(slashCommandsDir, folder);
    // Get all .js files inside this folder — each file is one command
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
    
    // Log which files are being loaded from this folder
    console.log(`Loading files from ${folder}:`, files);

    // Loop through each command file in this folder
    for (const file of files) {
        // Load the command file
        const command = require(path.join(folderPath, file));

        // Make sure the command has both a 'data' (name/description) and 'execute' (logic) property
        if (command.data && command.execute) {
            // Convert the command data to JSON format and add it to the commands array
             commands.push(command.data.toJSON());
        } else {
            // Warn if a command file is missing required properties so it's easy to spot and fix
             console.log(`[WARNING] The command ${file} is missing required "data" or "execute" property.`);
        }
    }
}

// Create a new REST client using Discord API version 10, authenticated with the bot token from .env
const rest = new REST({version: '10'}).setToken(process.env.Token);

// This is an immediately invoked async function — it runs right away without needing to be called
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands...`);

        // Send all the collected commands to Discord using a PUT request
        // This registers (or updates) all slash commands globally for the bot
        await rest.put(
            Routes.applicationCommands(process.env.ClientID), // Target the bot's application ID
            { body: commands } // Send the full list of commands as the request body
        );

        console.log('✅ Commands registered successfully');
    } catch (error) {
        // If registration fails, log the error so it can be debugged
        console.error(error);
    }
})();