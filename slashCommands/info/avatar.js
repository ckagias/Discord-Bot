const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Shows the target's avatar")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user you want to show the avatar for')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setTitle('Avatar')
            .setTimestamp()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`[png](${user.displayAvatarURL({ size: 2048, dynamic: true, extension: 'png' })}) | [jpg](${user.displayAvatarURL({ size: 2048, dynamic: true, extension: 'jpg' })}) | [webp](${user.displayAvatarURL({ size: 2048, dynamic: true, extension: 'webp' })})`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));

        await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};