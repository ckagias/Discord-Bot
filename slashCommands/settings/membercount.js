const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Returns current members of this server'),

    async execute(interaction) {
        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setTitle(`👥 Members in ${guild.name}`)
            .setColor(Colors.Blue)
            .setDescription(`This server has **${guild.memberCount} members**.`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};