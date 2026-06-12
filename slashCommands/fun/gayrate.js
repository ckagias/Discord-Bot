const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gayrate')
        .setDescription('Shows how gay someone is')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user you want to rate')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const gayrate = Math.floor(Math.random() * 101);
        const verb = user === interaction.user ? 'you are' : 'is';

        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setTitle('Gayrate 🏳️‍🌈')
            .setDescription(`**${user} ${verb} ${gayrate}% gay :rainbow_flag:**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};