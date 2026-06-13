const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');
const TicketSchema = require('../../models/TicketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-reset')
        .setDescription('Reset the ticket counter back to 0 and clear all ticket records.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await Promise.all([
            GuildSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { ticketCount: 0 }),
            TicketSchema.deleteMany({ guildId: interaction.guild.id }),
        ]);

        return interaction.reply({ content: 'Ticket counter reset. The next ticket will be `#0001`.', ephemeral: true });
    },
};