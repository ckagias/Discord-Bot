const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const HangmanGame = require('../../models/HangmanSchema');

module.exports = [
    {
        type: 'button',
        id: 'hangman_guess',

        async execute(interaction) {
            const game = await HangmanGame.findOne({ messageId: interaction.message.id });
            if (!game) return interaction.reply({ content: 'Game not found.', flags: MessageFlags.Ephemeral });
            if (game.userId !== interaction.user.id) return interaction.reply({ content: 'This is not your game!', flags: MessageFlags.Ephemeral });
            if (game.finished) return interaction.reply({ content: 'This game is already over.', flags: MessageFlags.Ephemeral });

            const modal = new ModalBuilder()
                .setCustomId(`hangman_modal_${interaction.message.id}`)
                .setTitle('Guess a Letter')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('letter')
                            .setLabel('Enter a single letter')
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(1)
                            .setMaxLength(1)
                            .setRequired(true)
                    )
                );

            await interaction.showModal(modal);
        },
    },
    {
        type: 'button',
        id: 'hangman_quit',

        async execute(interaction) {
            const game = await HangmanGame.findOne({ messageId: interaction.message.id });
            if (!game) return interaction.reply({ content: 'Game not found.', flags: MessageFlags.Ephemeral });
            if (game.userId !== interaction.user.id) return interaction.reply({ content: 'This is not your game!', flags: MessageFlags.Ephemeral });
            if (game.finished) return interaction.reply({ content: 'This game is already over.', flags: MessageFlags.Ephemeral });

            const { buildEmbed, buildRow } = require('../../utils/hangman');

            game.finished = true;
            game.won = false;
            await game.save();

            await interaction.update({
                embeds: [buildEmbed(game)],
                components: [buildRow(true)],
            });
        },
    },
];
