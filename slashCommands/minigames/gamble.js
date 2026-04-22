// Import the necessary discord.js tools:
// ButtonBuilder - creates clickable buttons
// ButtonStyle - provides preset styles for buttons (green, red, etc.)
// ComponentType - used to identify what type of component the user interacted with
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Bet your credits on a high-low roll!')
        // Add a required integer option with a minimum value of 1 so the user can't bet 0 or less
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The amount of credits to bet')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100000)),

    async execute(interaction) {
        // Get the amount the user chose to bet
        const bet = interaction.options.getInteger('amount');
        // Generate the first random number between 1 and 100
        const firstNumber = Math.floor(Math.random() * 100) + 1;
        
        // Build the initial embed showing the first number and asking the user to guess higher or lower
        const embed = new EmbedBuilder()
            .setTitle('🎲 High-Low Gamble')
            .setDescription(`The first number is **${firstNumber}**.\nWill the next number (1-100) be **Higher** or **Lower**?`)
            .addFields({ name: 'Your Bet', value: `💰 ${bet} credits`, inline: true })
            .setColor('Blurple')
            .setFooter({ text: 'You have 30 seconds to decide!' });

        // Create the Higher and Lower buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('higher') // ID used to identify which button was clicked
                .setLabel('Higher')
                .setStyle(ButtonStyle.Success), // Green button
            new ButtonBuilder()
                .setCustomId('lower') // ID used to identify which button was clicked
                .setLabel('Lower')
                .setStyle(ButtonStyle.Danger) // Red button
        );

        // Send the embed and buttons as a reply
        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        // Create a collector that listens for button clicks for up to 30 seconds
        // The filter makes sure only the user who ran the command can click the buttons
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000, 
            filter: i => i.user.id === interaction.user.id 
        });

        // This runs when the user clicks a button
        collector.on('collect', async (i) => {
            // Generate the second random number between 1 and 100
            const secondNumber = Math.floor(Math.random() * 100) + 1;
            // Determine if the second number is higher or lower than the first
            const result = secondNumber > firstNumber ? 'higher' : 'lower';
            // Check if the user's button choice matches the actual result
            const userWon = i.customId === result;

            // Handle the rare case where both numbers are exactly the same (a tie)
            if (secondNumber === firstNumber) {
                return i.update({
                    content: `😲 It was a tie (**${secondNumber}**)! Your bet was returned.`,
                    embeds: [],
                    components: [] // Remove the buttons
                });
            }

            // Build the result embed showing whether the user won or lost
            const resultEmbed = new EmbedBuilder()
                .setTitle(userWon ? '🎉 You Won!' : '💀 You Lost!')
                .setDescription(`The second number was **${secondNumber}**!`)
                .addFields(
                    { name: 'Your Choice', value: i.customId.toUpperCase(), inline: true },
                    // If the user won, show credits gained (bet x2); if lost, show credits lost
                    { name: 'Result', value: userWon ? `💰 +${bet * 2}` : `💸 -${bet}`, inline: true }
                )
                .setColor(userWon ? 'Green' : 'Red'); // Green if won, red if lost

            // Update the message with the result embed and remove the buttons
            await i.update({ embeds: [resultEmbed], components: [] });
            // Stop the collector since the game is over
            collector.stop();
        });

        // This runs when the collector stops (after 30 seconds with no interaction)
        collector.on('end', (collected, reason) => {
            // If time ran out and no button was clicked, cancel the game
            if (reason === 'time' && collected.size === 0) {
                interaction.editReply({ content: '⏰ Time is up! Gamble cancelled.', components: [] });
            }
        });
    },
};