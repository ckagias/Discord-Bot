const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the bot latency and API ping.'),

    async execute(interaction) {
        const client = interaction.client;

        const apiLatency = Math.round(client.ws.ping);
        const botLatency = Math.round(Date.now() - interaction.createdTimestamp);

        let embed = new EmbedBuilder()
            .setTitle('🏓 | Pong!')
            .setColor(Colors.Green)
            .addFields(
                { name: 'API Latency', value: `\`${apiLatency} ms\`` },
                { name: 'Bot Latency', value: `\`${botLatency} ms\`` }
            )
            .setTimestamp();

        await interaction.reply({embeds: [embed]});
    }
};