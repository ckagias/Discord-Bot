const { REST, Routes } = require('discord.js');
require('dotenv').config();

const guildId = process.argv[2];

if (!guildId) {
    console.error('Usage: node src/clean.js <guildId>');
    console.error('Deletes all guild-specific slash commands for the given server (e.g. leftover commands from testing).');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(process.env.Token);

(async () => {
    try {
        console.log(`Starting cleanup for Server ID: ${guildId}...`);
        // Sending an empty array removes all guild-specific commands
        await rest.put(
            Routes.applicationGuildCommands(process.env.ClientID, guildId),
            { body: [] }
        );
        console.log('Success! All old ghost commands for this server have been deleted.');
    } catch (error) {
        console.error('Error cleaning up:', error);
    }
})();
