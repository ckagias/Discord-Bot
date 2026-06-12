const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Displays information about the server'),

    async execute(interaction) {
        const { guild } = interaction;
        const channels = await guild.channels.fetch();

        const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
        const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;
        const stageChannels = channels.filter(c => c.type === ChannelType.GuildStageVoice).size;
        const newsChannels = channels.filter(c => c.type === ChannelType.GuildAnnouncement).size;
        const threadChannels = channels.filter(c => [ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread].includes(c.type)).size;
        const totalChannels = textChannels + voiceChannels + threadChannels + categories + stageChannels + newsChannels;

        const bots = guild.members.cache.filter(member => member.user.bot).size;
        const humans = guild.memberCount - bots;

        const embed = new EmbedBuilder()
            .setTitle('Server Information')
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: '🛡️ | General',
                    // <t:...:R> renders as a relative Discord timestamp (e.g. "3 months ago")
                    value: `➥ **Owner:** <@${guild.ownerId}>\n➥ **Name:** ${guild.name}\n➥ **Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>\n➥ **Verification:** ${guild.verificationLevel}\n➥ **Boosts:** ${guild.premiumSubscriptionCount}`
                },
                {
                    name: '👥 | Members',
                    value: `➥ **Total:** ${guild.memberCount}\n➥ **Humans:** ${humans}\n➥ **Bots:** ${bots}`
                },
                {
                    name: '🎭 | Roles',
                    value: `➥ **Total Roles:** ${guild.roles.cache.size}`
                },
                {
                    name: '💬 | Channels',
                    value: `➥ **Text:** ${textChannels}\n➥ **Voice:** ${voiceChannels}\n➥ **Threads:** ${threadChannels}\n➥ **Categories:** ${categories}\n➥ **Stages:** ${stageChannels}\n➥ **News:** ${newsChannels}\n\n➥ **Total:** ${totalChannels}`
                },
                {
                    name: '😎 | Assets',
                    value: `➥ **Animated:** ${guild.emojis.cache.filter(e => e.animated).size}\n➥ **Static:** ${guild.emojis.cache.filter(e => !e.animated).size}\n➥ **Stickers:** ${guild.stickers.cache.size}`
                }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};