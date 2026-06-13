const { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSchema = require('../models/GuildSchema');
const TicketSchema = require('../models/TicketSchema');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                const payload = { content: 'Error executing command', ephemeral: true };
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply(payload).catch(() => {});
                } else {
                    await interaction.reply(payload).catch(() => {});
                }
            }
            return;
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'ticket_open') {
                await handleTicketOpen(interaction);
            } else if (interaction.customId === 'ticket_close_btn') {
                await handleTicketCloseButton(interaction);
            }
        }
    }
};

async function handleTicketOpen(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const config = await GuildSchema.findOne({ guildId: interaction.guild.id });
    if (!config?.ticketCategoryId || !config?.ticketSupportRoleId)
        return interaction.editReply({ content: 'The ticket system is not configured. Contact an administrator.' });

    const category = await interaction.guild.channels.fetch(config.ticketCategoryId).catch(() => null);
    if (!category)
        return interaction.editReply({ content: 'The configured ticket category no longer exists. Ask an admin to run `/ticket-setup` again.' });

    const existing = await TicketSchema.findOne({ guildId: interaction.guild.id, userId: interaction.user.id, status: 'open' });
    if (existing) {
        const channel = await interaction.guild.channels.fetch(existing.channelId).catch(() => null);
        if (!channel) {
            await TicketSchema.deleteOne({ _id: existing._id });
        } else {
            return interaction.editReply({ content: `You already have an open ticket: ${channel}.` });
        }
    }

    const updated = await GuildSchema.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $inc: { ticketCount: 1 } },
        { new: true }
    );
    const ticketNumber = updated.ticketCount;

    const channel = await interaction.guild.channels.create({
        name: `ticket-${String(ticketNumber).padStart(4, '0')}`,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
            { id: config.ticketSupportRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] },
        ],
    });

    await TicketSchema.create({
        guildId: interaction.guild.id,
        channelId: channel.id,
        userId: interaction.user.id,
        ticketNumber,
    });

    const embed = new EmbedBuilder()
        .setTitle(`Ticket #${String(ticketNumber).padStart(4, '0')}`)
        .setDescription(`Hello ${interaction.user}, thank you for opening a ticket. Please describe your issue and a staff member will assist you shortly.`)
        .setColor(0x5865F2)
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_close_btn')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
    );

    await channel.send({ content: `${interaction.user} | <@&${config.ticketSupportRoleId}>`, embeds: [embed], components: [row] });

    return interaction.editReply({ content: `Your ticket has been created: ${channel}.` });
}

async function handleTicketCloseButton(interaction) {
    const ticket = await TicketSchema.findOne({ channelId: interaction.channel.id, status: 'open' });

    if (!ticket)
        return interaction.reply({ content: 'This ticket is already closed.', ephemeral: true });

    const isSupport = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels);
    const isOwner = ticket.userId === interaction.user.id;

    if (!isSupport && !isOwner)
        return interaction.reply({ content: 'You do not have permission to close this ticket.', ephemeral: true });

    await interaction.reply({ content: `Ticket closed by ${interaction.user}. This channel will be deleted in 5 seconds.` });

    await TicketSchema.findOneAndUpdate({ channelId: interaction.channel.id }, { status: 'closed' });

    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
}