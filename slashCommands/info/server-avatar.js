const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-avatar')
        .setDescription("Shows the target's server avatar")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user you want to show the avatar for')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setTitle('Avatar')
            .setTimestamp()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`[png](${member.displayAvatarURL({ size: 2048, dynamic: true, extension: 'png' })}) | [jpg](${member.displayAvatarURL({ size: 2048, dynamic: true, extension: 'jpg' })}) | [webp](${member.displayAvatarURL({ size: 2048, dynamic: true, extension: 'webp' })})`)
            .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }));

        await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
};