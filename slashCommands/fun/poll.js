// Import SlashCommandBuilder to create a slash command and EmbedBuilder to create fancy embedded messages
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Emoji labels for up to 4 options
const OPTION_EMOJIS = ['🇦', '🇧', '🇨', '🇩'];

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll with up to 4 options.')
        // Add a required text option for the poll question
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The poll question')
                .setRequired(true))
        // Add two required options — a poll needs at least two choices
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(true))
        // Add two more optional options for polls with more choices
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('Third option (optional)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('Fourth option (optional)')
                .setRequired(false)),

    async execute(interaction) {
        // Get the poll question the user typed in the slash command
        const question = interaction.options.getString('question');

        // Collect provided options (only non-null ones)
        const rawOptions = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3'),
            interaction.options.getString('option4'),
        ].filter(Boolean);

        // Build the options list for the embed
        const optionsText = rawOptions
            .map((opt, i) => `${OPTION_EMOJIS[i]}  ${opt}`)
            .join('\n');

        // Build the poll embed with the question as the title and options as the description
        const embed = new EmbedBuilder()
            .setColor(0x5865F2) // Discord blurple color
            .setTitle('📊 ' + question)
            .setDescription(optionsText)
            .setFooter({ text: `Poll created by ${interaction.user.tag}` }) // Show who created the poll
            .setTimestamp();

        // Send the poll embed as a reply in the channel
        await interaction.reply({ embeds: [embed] });

        // Fetch the reply so we can add reactions to it
        const pollMessage = await interaction.fetchReply();

        // Add a reaction emoji for each option so users can vote by clicking them
        for (let i = 0; i < rawOptions.length; i++) {
            await pollMessage.react(OPTION_EMOJIS[i]);
        }
    },
};
