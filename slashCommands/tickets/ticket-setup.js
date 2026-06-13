const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Configure the ticket system.')
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('Category where ticket channels will be created')
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('support-role')
                .setDescription('Role that can see and manage tickets')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
            return interaction.reply({ content: 'You do not have permission to configure the ticket system.', ephemeral: true });

        const category = interaction.options.getChannel('category');
        const supportRole = interaction.options.getRole('support-role');

await GuildSchema.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { ticketCategoryId: category.id, ticketSupportRoleId: supportRole.id },
            { upsert: true }
        );

        return interaction.reply({
            content: `Ticket system configured.\n**Category:** ${category.name}\n**Support Role:** ${supportRole}`,
            ephemeral: true,
        });
    },
};