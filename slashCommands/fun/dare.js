const { SlashCommandBuilder } = require('discord.js');
const { dares } = require('../../data/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dare')
        .setDescription('Sends a random dare question'),

    async execute(interaction) {
        const randomMessage = dares[Math.floor(Math.random() * dares.length)];
        await interaction.reply(`**${randomMessage}**`);
    }
};