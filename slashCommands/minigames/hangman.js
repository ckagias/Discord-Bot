const { SlashCommandBuilder } = require('discord.js');
const HangmanGame = require('../../models/HangmanSchema');
const { pickWord, buildEmbed, buildRow } = require('../../utils/hangman');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Start a game of Hangman and earn coins for guessing the word.'),

    async execute(interaction) {
        await interaction.deferReply();

        const word = pickWord();
        const game = { word, guessed: [], wrong: 0, won: false, finished: false };

        const message = await interaction.editReply({
            embeds: [buildEmbed(game)],
            components: [buildRow(false)],
        });

        await HangmanGame.create({
            messageId: message.id,
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            word,
        });
    },
};
