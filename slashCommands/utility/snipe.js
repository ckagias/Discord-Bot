const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Shows the last deleted message in this channel.'),

    async execute(interaction) {
        const cached = interaction.client.snipeCache?.get(interaction.channelId);

        if (!cached) {
            return interaction.reply({ content: 'No recently deleted messages found in this channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setAuthor({
                name: cached.author.tag,
                iconURL: cached.author.displayAvatarURL({ size: 64 }),
            })
            .setDescription(cached.content || '*No text content*')
            .setFooter({ text: `Deleted` })
            .setTimestamp(cached.deletedAt);

        if (cached.attachmentURL) {
            embed.setImage(cached.attachmentURL);
        }

        await interaction.reply({ embeds: [embed] });
    },
};