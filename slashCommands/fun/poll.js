const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const OPTION_EMOJIS = ['🇦', '🇧', '🇨', '🇩'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll with up to 4 options.')
        .addStringOption(option =>
            option.setName('question').setDescription('The poll question').setRequired(true))
        .addStringOption(option =>
            option.setName('option1').setDescription('First option').setRequired(true))
        .addStringOption(option =>
            option.setName('option2').setDescription('Second option').setRequired(true))
        .addStringOption(option =>
            option.setName('option3').setDescription('Third option (optional)').setRequired(false))
        .addStringOption(option =>
            option.setName('option4').setDescription('Fourth option (optional)').setRequired(false)),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const rawOptions = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3'),
            interaction.options.getString('option4'),
        ].filter(Boolean);

        const optionsText = rawOptions.map((opt, i) => `${OPTION_EMOJIS[i]}  ${opt}`).join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📊 ' + question)
            .setDescription(optionsText)
            .setFooter({ text: `Poll created by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        const pollMessage = await interaction.fetchReply();
        for (let i = 0; i < rawOptions.length; i++) {
            await pollMessage.react(OPTION_EMOJIS[i]);
        }
    },
};