const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsetwelcome')
        .setDescription('Disable welcome messages for this server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
            return interaction.reply({ content: 'You do not have permission to manage server settings.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        await GuildSchema.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { $set: { welcomeChannelId: null, welcomeMessage: null }, $setOnInsert: { guildId: interaction.guild.id } },
            { upsert: true }
        );

        return interaction.editReply({ content: 'Welcome messages have been disabled.' });
    },
};