const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playback and clear the queue.'),

    async execute(interaction, client) {
        const player = client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: 'Nothing is playing right now.', flags: MessageFlags.Ephemeral });
        }

        try {
            await player.stopPlaying(true, true);
            await player.destroy();

            const embed = new EmbedBuilder()
                .setColor(Math.floor(Math.random() * 0xFFFFFF))
                .setDescription('⏹️ Stopped playback and cleared the queue.');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('[stop] Lavalink error:', error);
            await interaction.reply({ content: 'Failed to stop playback. Please try again.', flags: MessageFlags.Ephemeral }).catch(() => {});
        }
    },
};