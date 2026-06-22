const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('farewell')
        .setDescription('Manage member leave announcements.')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set the channel and message for member leave announcements.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The text channel to send farewell messages to')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Custom message. Use {user} for the username and {server} for the server name.')
                        .setRequired(false))
        )
        .addSubcommand(sub =>
            sub.setName('unset')
                .setDescription('Disable farewell messages for this server.')
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

            const update = { $set: { farewellChannelId: channel.id }, $setOnInsert: { guildId: interaction.guild.id } };
            if (message) update.$set.farewellMessage = message;

            await GuildSchema.findOneAndUpdate(
                { guildId: interaction.guild.id },
                update,
                { upsert: true }
            );

            const preview = message ?? '**{user}** has left **{server}**.';
            return interaction.editReply({
                content: `Farewell channel set to ${channel}.\nMessage: \`${preview}\``,
            });
        }

        if (sub === 'unset') {
            await GuildSchema.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { $set: { farewellChannelId: null, farewellMessage: null }, $setOnInsert: { guildId: interaction.guild.id } },
                { upsert: true }
            );

            return interaction.editReply({ content: 'Farewell messages have been disabled.' });
        }
    },
};
