const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TicketSchema = require('../../models/TicketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-close')
        .setDescription('Close this ticket channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const ticket = await TicketSchema.findOne({ channelId: interaction.channel.id, status: 'open' });

        if (!ticket)
            return interaction.reply({ content: 'This command can only be used inside an open ticket channel.', ephemeral: true });

        const isSupport = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels);
        const isOwner = ticket.userId === interaction.user.id;

        if (!isSupport && !isOwner)
            return interaction.reply({ content: 'You do not have permission to close this ticket.', ephemeral: true });

        await interaction.reply({ content: `Ticket closed by ${interaction.user}. This channel will be deleted in 5 seconds.` });

        await TicketSchema.findOneAndUpdate({ channelId: interaction.channel.id }, { status: 'closed' });

        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    },
};