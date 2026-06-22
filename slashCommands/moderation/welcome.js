const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Manage member join announcements.')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set the channel and message for member join announcements.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The text channel to send welcome messages to')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Custom message. Use {user} for a mention and {server} for the server name.')
                        .setRequired(false))
        )
        .addSubcommand(sub =>
            sub.setName('unset')
                .setDescription('Disable welcome messages for this server.')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
            return interaction.reply({ content: 'You do not have permission to manage server settings.', ephemeral: true });

        const sub = interaction.options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });

        if (sub === 'set') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');

            const update = { $set: { welcomeChannelId: channel.id }, $setOnInsert: { guildId: interaction.guild.id } };
            if (message) update.$set.welcomeMessage = message;

            await GuildSchema.findOneAndUpdate(
                { guildId: interaction.guild.id },
                update,
                { upsert: true }
            );

            const preview = message ?? 'Welcome to **{server}**, {user}!';
            return interaction.editReply({
                content: `Welcome channel set to ${channel}.\nMessage: \`${preview}\``,
            });
        }

        if (sub === 'unset') {
            await GuildSchema.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { $set: { welcomeChannelId: null, welcomeMessage: null }, $setOnInsert: { guildId: interaction.guild.id } },
                { upsert: true }
            );

            return interaction.editReply({ content: 'Welcome messages have been disabled.' });
        }
    },
};
