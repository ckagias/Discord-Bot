const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSchema = require('../../models/GuildSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleleveling')
        .setDescription('Enable or disable the XP leveling system for this server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const { guild } = interaction;

        const guildData = await GuildSchema.findOneAndUpdate(
            { guildId: guild.id },
            { $setOnInsert: { guildId: guild.id } },
            { upsert: true, returnDocument: true }
        );

        guildData.levelingEnabled = !guildData.levelingEnabled;
        await guildData.save();

        const status = guildData.levelingEnabled ? '**Enabled**' : '**Disabled**';
        return interaction.editReply({ content: `The leveling system is now ${status} for **${guild.name}**.` });
    },
};