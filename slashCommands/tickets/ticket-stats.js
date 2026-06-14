const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');
const TicketSchema = require('../../models/TicketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-stats')
        .setDescription('Show ticket statistics for this server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const [config, total, open, closed] = await Promise.all([
            GuildSchema.findOne({ guildId: interaction.guild.id }),
            TicketSchema.countDocuments({ guildId: interaction.guild.id }),
            TicketSchema.countDocuments({ guildId: interaction.guild.id, status: 'open' }),
            TicketSchema.countDocuments({ guildId: interaction.guild.id, status: 'closed' }),
        ]);

        const embed = new EmbedBuilder()
            .setTitle('Ticket Statistics')
            .addFields(
                { name: 'Total Created', value: `${config?.ticketCount ?? 0}`, inline: true },
                { name: 'Currently Open', value: `${open}`, inline: true },
                { name: 'Closed', value: `${closed}`, inline: true },
            )
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};