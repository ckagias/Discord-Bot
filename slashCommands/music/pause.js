const { SlashCommandBuilder, Colors, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current track.'),

    async execute(interaction, client) {
        const player = client.lavalink.getPlayer(interaction.guild.id);

        if (!player || !player.playing) {
            return interaction.reply({ content: '❌ Nothing is playing right now.'});
        }

        if (player.paused) {
            return interaction.reply({ content: '⏸️ The player is already paused.'});
        }

        await player.pause();

        const embed = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setDescription('⏸️ Paused. Use `/resume` to continue.');

        await interaction.reply({ embeds: [embed] });
    },
};