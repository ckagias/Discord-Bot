const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription("Shows bot's uptime"),

    async execute(interaction) {
        const client = interaction.client;

        let seconds = Math.floor(client.uptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setTitle('Kafeneios Eros Uptime 📈')
            .setDescription(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);

        await interaction.reply({ embeds: [embed] });
    }
};