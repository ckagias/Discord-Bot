const { SlashCommandBuilder, Colors, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playback and clear the queue.'),

    async execute(interaction, client) {
        const player = client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: '❌ Nothing is playing right now.'});
        }

        await player.stopPlaying(true, true);
        await player.destroy();

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription('⏹️ Stopped playback and cleared the queue.');

        await interaction.reply({ embeds: [embed] });
    },
};