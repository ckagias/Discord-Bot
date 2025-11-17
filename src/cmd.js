const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const folders = fs.readdirSync(path.join(__dirname, '../slashCommands'));

for (const folder of folders) {
    const files = fs.readdirSync(`./slashCommands/${folder}`).filter(f => f.endsWith('.js'));
    console.log(`Loading files from ${folder}:`, files);

    for (const file of files) {
        const command = require(path.join(__dirname, '..', 'slashCommands', folder, file));
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({version: '10'}).setToken(process.env.Token);

(async () => {
    try {
        console.log('Refreshing slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.ClientID),
            { body: commands }
        );

        console.log('Commands registered successfully');
    } catch (error) {
        console.error(error);
    }
})