const { EmbedBuilder } = require('discord.js');
const { getLogChannel } = require('../utils/logger');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (!newMessage.guild) return;
        if (newMessage.author?.bot) return;
        if (oldMessage.content === newMessage.content) return;

        if (!client.editSnipeCache) client.editSnipeCache = new Map();
        if (oldMessage.content) {
            client.editSnipeCache.set(newMessage.channelId, {
                before: oldMessage.content,
                after: newMessage.content,
                author: newMessage.author,
                editedAt: new Date(),
                messageURL: newMessage.url,
            });
        }

        const logChannel = await getLogChannel(newMessage.guild).catch(() => null);
        if (!logChannel) return;

        const author = newMessage.author;
        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .setAuthor({
                name: author.username,
                iconURL: author.displayAvatarURL({ size: 64 }),
            })
            .setDescription(`**${author.username}** edited a message in <#${newMessage.channelId}> — [Jump to message](${newMessage.url})`)
            .addFields(
                { name: 'User ID', value: `\`${author.id}\``, inline: true },
                { name: 'Channel ID', value: `\`${newMessage.channelId}\``, inline: true },
                { name: 'Before', value: oldMessage.content || '*Unknown*' },
                { name: 'After', value: newMessage.content || '*Empty*' }
            )
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    },
};