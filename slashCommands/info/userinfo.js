const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Shows detailed information about a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to look up')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        // Fetch the full user object to access banner and accent colour
        const fetchedUser = await user.fetch();
        const member = interaction.guild?.members.cache.get(user.id);

        const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`;
        const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'N/A';

        const roles = member
            ? member.roles.cache
                .filter(r => r.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(r => `${r}`)
                .join(', ') || 'None'
            : 'N/A';

        const flags = fetchedUser.flags?.toArray();
        const badges = flags?.length ? flags.map(f => f.replace(/_/g, ' ')).join(', ') : 'None';

        const embed = new EmbedBuilder()
            .setColor(fetchedUser.accentColor ?? Math.floor(Math.random() * 0xFFFFFF))
            .setTitle(user.tag)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🆔 User ID', value: user.id, inline: true },
                { name: '🤖 Bot', value: user.bot ? '✅' : '❌', inline: true },
                { name: '📅 Account Created', value: createdAt, inline: true },
                { name: '📥 Joined Server', value: joinedAt, inline: true },
                { name: '​', value: '​', inline: true },
                { name: '🏅 Badges', value: badges, inline: true },
                { name: `🎭 Roles [${member?.roles.cache.size - 1 || 0}]`, value: roles, inline: false },
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        if (fetchedUser.banner) {
            embed.setImage(fetchedUser.bannerURL({ size: 1024 }));
        }

        await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
};