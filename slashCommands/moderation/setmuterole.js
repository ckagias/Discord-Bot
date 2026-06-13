const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmuterole')
        .setDescription('Set the role to assign when a member is muted.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The muted role')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
            return interaction.reply({ content: 'You do not have permission to manage server settings.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        const role = interaction.options.getRole('role');

        await GuildSchema.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { $set: { muteRoleId: role.id }, $setOnInsert: { guildId: interaction.guild.id } },
            { upsert: true }
        );

        return interaction.editReply({ content: `Mute role set to ${role}.` });
    },
};