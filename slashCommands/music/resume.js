const { SlashCommandBuilder, Colors, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused track.'),

    async execute(interaction, client) {
        const player = client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: '❌ Nothing is playing right now.'});
        }

        if (!player.paused) {
            return interaction.reply({ content: '▶️ The player is not paused.'});
        }

        await player.resume();

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription('▶️ Resumed.');

        await interaction.reply({ embeds: [embed] });
    },
};