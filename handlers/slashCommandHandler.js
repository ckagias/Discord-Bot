// 'fs' lets us read files and folders on the computer
const fs = require('fs');
// 'path' helps us build file paths that work on any operating system
const path = require('path');

// This function is called from index.js and receives the bot client as a parameter
module.exports = (client) => {
    // Create a new Map on the client to store all slash commands
    client.commands = new Map();

    // Read all category folder names inside the slashCommands directory (e.g. fun, info, utility)
    const folders = fs.readdirSync(path.join(__dirname, `../slashCommands`));

    // Loop through each category folder
    for (const folder of folders) {
        // Build the full path to this specific folder
        const commandsPath = path.join(__dirname, `../slashCommands`, folder);
        // Get all .js files inside this folder — each file is one command
        const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

        // Loop through each command file and load it into the commands Map
        for (const file of files) {
            // Load the command file
            const command = require(path.join(commandsPath, file));
            // Store the command in the Map using its name as the key
            // This allows interactionCreate.js to look up commands by name when a user runs one
            client.commands.set(command.data.name, command);
        }
    }
}