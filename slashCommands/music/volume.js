const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set or check the playback volume.')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (1–100)')
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction, client) {
        const player = client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: '❌ Nothing is playing right now.'});
        }

        const level = interaction.options.getInteger('level');

        if (level === null) {
            return interaction.reply({ content: `🔊 Current volume: **${player.volume}%**`});
        }

        await player.setVolume(level);

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(`🔊 Volume set to **${level}%**`);

        await interaction.reply({ embeds: [embed] });
    },
};