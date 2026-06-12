const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show details about the currently playing track.'),

    async execute(interaction, client) {
        const player = client.lavalink.getPlayer(interaction.guild.id);

        if (!player || !player.queue.current) {
            return interaction.reply({ content: '❌ Nothing is playing right now.'});
        }

        const track = player.queue.current;
        const position = player.position;
        const duration = track.info.duration;

        const progressBar = track.info.isStream ? '🔴 LIVE' : buildProgressBar(position, duration);

        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setAuthor({ name: 'Now Playing', iconURL: client.user.displayAvatarURL({ size: 32 }) })
            .setDescription(`**[${track.info.title}](${track.info.uri})**`)
            .addFields(
                { name: 'Author', value: track.info.author, inline: true },
                { name: 'Duration', value: track.info.isStream ? 'LIVE' : `${formatDuration(position)} / ${formatDuration(duration)}`, inline: true },
                { name: 'Requested By', value: `${track.requester}`, inline: true },
                { name: 'Progress', value: progressBar },
            )
            .setThumbnail(track.info.artworkUrl ?? null)

        await interaction.reply({ embeds: [embed] });
    },
};

function buildProgressBar(position, duration) {
    const BAR_LENGTH = 20;
    const filled = Math.round((position / duration) * BAR_LENGTH);
    const empty = BAR_LENGTH - filled;
    return `\`[${'▬'.repeat(filled)}🔘${'─'.repeat(Math.max(0, empty - 1))}]\``;
}

function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
}