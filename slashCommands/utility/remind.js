const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const ReminderSchema = require('../../models/ReminderSchema');

const MAX_ACTIVE_PER_USER = 25;

function parseDuration(str) {
    const match = str.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return null;
    const value = parseInt(match[1]);
    const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return value * units[match[2]];
}

async function sendReminder(client, reminder) {
    const update = await ReminderSchema.updateOne({ _id: reminder._id, sent: false }, { $set: { sent: true } });
    if (update.modifiedCount === 0) return;

    const channel = await client.channels.fetch(reminder.channelId).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle('⏰ Reminder')
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setDescription(reminder.message)
        .setTimestamp();

    await channel.send({ content: `<@${reminder.userId}>`, embeds: [embed] }).catch(() => {});
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set a personal reminder.')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set a new reminder.')
                .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 10m, 2h, 1d').setRequired(true))
                .addStringOption(o => o.setName('message').setDescription('What should I remind you about?').setMaxLength(500).setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('List your active reminders.'))
        .addSubcommand(sub =>
            sub.setName('cancel')
                .setDescription('Cancel a reminder.')
                .addStringOption(o => o.setName('id').setDescription('Reminder ID from /remind list').setRequired(true))),

    sendReminder,

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'set') {
            const durationStr = interaction.options.getString('duration');
            const message = interaction.options.getString('message').trim();

            const ms = parseDuration(durationStr);
            if (!ms) return interaction.reply({ content: 'Invalid duration. Use formats like `10m`, `2h`, `1d`.', flags: MessageFlags.Ephemeral });
            if (ms < 10000) return interaction.reply({ content: 'Duration must be at least 10 seconds.', flags: MessageFlags.Ephemeral });
            if (ms > 90 * 86400000) return interaction.reply({ content: 'Duration must be at most 90 days.', flags: MessageFlags.Ephemeral });

            const activeCount = await ReminderSchema.countDocuments({ userId: interaction.user.id, sent: false });
            if (activeCount >= MAX_ACTIVE_PER_USER) {
                return interaction.reply({ content: `You already have ${MAX_ACTIVE_PER_USER} active reminders. Cancel some with \`/remind cancel\` first.`, flags: MessageFlags.Ephemeral });
            }

            const remindAt = new Date(Date.now() + ms);

            const reminder = await ReminderSchema.create({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
                channelId: interaction.channel.id,
                message,
                remindAt,
            });

            setTimeout(() => sendReminder(client, reminder), ms);

            return interaction.reply({
                content: `Got it! I'll remind you <t:${Math.floor(remindAt.getTime() / 1000)}:R>.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (sub === 'list') {
            const reminders = await ReminderSchema.find({ userId: interaction.user.id, sent: false }).sort({ remindAt: 1 });

            if (!reminders.length) {
                return interaction.reply({ content: 'You have no active reminders.', flags: MessageFlags.Ephemeral });
            }

            const lines = reminders.map(r => `• \`${r._id}\` — ${r.message} — <t:${Math.floor(r.remindAt.getTime() / 1000)}:R>`);

            const embed = new EmbedBuilder()
                .setTitle('⏰ Your Reminders')
                .setColor(Math.floor(Math.random() * 0xFFFFFF))
                .setDescription(lines.join('\n'));

            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        if (sub === 'cancel') {
            const id = interaction.options.getString('id').trim();

            const result = await ReminderSchema.deleteOne({ _id: id, userId: interaction.user.id, sent: false }).catch(() => null);
            if (!result || result.deletedCount === 0) {
                return interaction.reply({ content: 'No active reminder found with that ID.', flags: MessageFlags.Ephemeral });
            }

            return interaction.reply({ content: 'Reminder cancelled.', flags: MessageFlags.Ephemeral });
        }
    },
};
