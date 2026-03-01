// Import SlashCommandBuilder for the slash command, EmbedBuilder for fancy messages, and ChannelType to identify what type each channel is (text, voice, etc.)
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Displays information about the server'),

    async execute(interaction) {
        // Destructure 'guild' from interaction — 'guild' represents the server this command was used in
        const { guild } = interaction;
        // Fetch all channels in the server (returns a collection we can filter through)
        const channels = await guild.channels.fetch();
        // Count the total number of roles in the server
        const roles = guild.roles.cache.size;
        // Get the total number of members in the server
        const members = guild.memberCount;
        // Count only text channels
        const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
        // Count only voice channels
        const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
        // Count only category channels (the folders that group channels together)
        const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;
        // Count only stage channels (used for large audio events)
        const stageChannels = channels.filter(c => c.type === ChannelType.GuildStageVoice).size;
        // Count only announcement (news) channels
        const newsChannels = channels.filter(c => c.type === ChannelType.GuildAnnouncement).size;
        // Count all thread types: public, private, and announcement threads
        const threadChannels = channels.filter(c => [ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread].includes(c.type)).size;
        // Add up all channel types to get the total channel count
        const totalChannels = textChannels + voiceChannels + threadChannels + categories + stageChannels + newsChannels;
        // Count how many members are bots
        const bots = guild.members.cache.filter(member => member.user.bot).size;
        // Subtract bots from total members to get the human count
        const humans = members - bots;

        const embed = new EmbedBuilder()
        .setTitle("Server Information")
        .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
        // Show the server's icon as a thumbnail in the top-right of the embed
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
            {
                name: '🛡️ | General',
                // <t:...:R> is a Discord timestamp that shows time in a relative format (e.g. "3 months ago")
                value: `➥ **Owner:** <@${guild.ownerId}>\n➥ **Name:** ${guild.name}\n➥ **Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>\n➥ **Verification:** ${guild.verificationLevel}\n➥ **Boosts:** ${guild.premiumSubscriptionCount}`
            },
            {
                name: '👥 | Members',
                value: `➥ **Total:** ${members}\n➥ **Humans:** ${humans}\n➥ **Bots:** ${bots}`
            },
            {
                name: '🎭 | Roles',
                value: `➥ **Total Roles:** ${roles}`
            },
            {
                name: '💬 | Channels',
                value: `➥ **Text:** ${textChannels}\n➥ **Voice:** ${voiceChannels}\n➥ **Threads:** ${threadChannels}\n➥ **Categories:** ${categories}\n➥ **Stages:** ${stageChannels}\n➥ **News:** ${newsChannels}\n\n➥ **Total:** ${totalChannels}`
            },
            {
                name: '😎 | Assets',
                // Filter emojis by whether they're animated or not, then count stickers separately
                value: `➥ **Animated:** ${guild.emojis.cache.filter(e => e.animated).size}\n➥ **Static:** ${guild.emojis.cache.filter(e => !e.animated).size}\n➥ **Stickers:** ${guild.stickers.cache.size}`
            }
        )
        // Show who requested the command in the footer
        .setFooter({ 
            text: `Requested by ${interaction.user.tag}`, 
            iconURL: interaction.user.displayAvatarURL() 
        })
        .setTimestamp();

        // Send the embed as a reply
        await interaction.reply({ embeds: [embed] });
  }
};