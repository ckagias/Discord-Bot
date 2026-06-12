const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

const PAGE_SIZE = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current queue.')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number')
                .setMinValue(1)
        ),

    async execute(interaction, client) {
        const player = client.lavalink.getPlayer(interaction.guild.id);

        if (!player || !player.queue.current) {
            return interaction.reply({ content: '❌ Nothing is playing right now.'});
        }

        const queue = player.queue.tracks;
        const page = (interaction.options.getInteger('page') ?? 1) - 1;
        const totalPages = Math.max(1, Math.ceil(queue.length / PAGE_SIZE));

        if (page >= totalPages) {
            return interaction.reply({ content: `❌ Page ${page + 1} doesn't exist. Max page is ${totalPages}.`});
        }

        const current = player.queue.current;
        const slice = queue.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

        const description = slice.length > 0
            ? slice.map((t, i) => `**${page * PAGE_SIZE + i + 1}.** [${t.info.title}](${t.info.uri}) — ${t.info.author}`).join('\n')
            : '*No more tracks in queue.*';

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle('🎶 Queue')
            .setDescription(
                `**Now Playing:**\n[${current.info.title}](${current.info.uri}) — ${current.info.author}\n\n**Up Next:**\n${description}`
            )
            .setFooter({ text: `Page ${page + 1}/${totalPages} · ${queue.length} track(s) in queue` });

        await interaction.reply({ embeds: [embed] });
    },
};