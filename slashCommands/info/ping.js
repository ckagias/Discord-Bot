const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the bot latency and API ping.'),

    async execute(interaction) {
        const apiLatency = Math.round(interaction.client.ws.ping);
        const botLatency = Math.round(Date.now() - interaction.createdTimestamp);

        const embed = new EmbedBuilder()
            .setTitle('🏓 | Pong!')
            .setColor(Colors.Green)
            .addFields(
                { name: 'API Latency', value: `\`${apiLatency} ms\`` },
                { name: 'Bot Latency', value: `\`${botLatency} ms\`` }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};