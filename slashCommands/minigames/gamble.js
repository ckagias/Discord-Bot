const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Bet your credits on a high-low roll!')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of credits to bet')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100000)),

    async execute(interaction) {
        const bet = interaction.options.getInteger('amount');
        const firstNumber = Math.floor(Math.random() * 100) + 1;

        const embed = new EmbedBuilder()
            .setTitle('🎲 High-Low Gamble')
            .setDescription(`The first number is **${firstNumber}**.\nWill the next number (1-100) be **Higher** or **Lower**?`)
            .addFields({ name: 'Your Bet', value: `💰 ${bet} credits`, inline: true })
            .setColor('Blurple')
            .setFooter({ text: 'You have 30 seconds to decide!' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('higher').setLabel('Higher').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('lower').setLabel('Lower').setStyle(ButtonStyle.Danger)
        );

        const response = await interaction.reply({ embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000,
            filter: i => i.user.id === interaction.user.id
        });

        collector.on('collect', async (i) => {
            const secondNumber = Math.floor(Math.random() * 100) + 1;
            const result = secondNumber > firstNumber ? 'higher' : 'lower';
            const userWon = i.customId === result;

            if (secondNumber === firstNumber) {
                return i.update({
                    content: `😲 It was a tie (**${secondNumber}**)! Your bet was returned.`,
                    embeds: [],
                    components: []
                });
            }

            const resultEmbed = new EmbedBuilder()
                .setTitle(userWon ? '🎉 You Won!' : '💀 You Lost!')
                .setDescription(`The second number was **${secondNumber}**!`)
                .addFields(
                    { name: 'Your Choice', value: i.customId.toUpperCase(), inline: true },
                    { name: 'Result', value: userWon ? `💰 +${bet * 2}` : `💸 -${bet}`, inline: true }
                )
                .setColor(userWon ? 'Green' : 'Red');

            await i.update({ embeds: [resultEmbed], components: [] });
            collector.stop();
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                interaction.editReply({ content: '⏰ Time is up! Gamble cancelled.', components: [] });
            }
        });
    },
};