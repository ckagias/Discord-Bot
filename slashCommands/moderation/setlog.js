const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlog')
        .setDescription('Set the channel where server events will be logged.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The text channel to send logs to')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
            return interaction.reply({ content: 'You do not have permission to manage server settings.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel('channel');

        await GuildSchema.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { $set: { logChannelId: channel.id }, $setOnInsert: { guildId: interaction.guild.id } },
            { upsert: true }
        );

        return interaction.editReply({ content: `Log channel set to ${channel}.` });
    },
};