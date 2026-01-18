const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const os = require("os");
const { outdent } = require("outdent");
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Returns bot's information"),

    async execute(interaction) {
        const client = interaction.client;

        let seconds = Math.floor(client.uptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        const platform = process.platform.replace(/win32/g, "Windows");
        const architecture = os.arch();
        const cores = os.cpus().length;
        const cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`;

        const botUsed = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;

        let embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(Math.floor(Math.random() * 0xFFFFFF))
            .addFields(
                { name: 'Name', value: `${client.user.tag}`, inline: true },
                { name: 'ID', value: `${client.user.id}`, inline: true },
                { name: 'Created At', value: `${moment(client.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(client.user.createdAt).fromNow()})`, inline: false },
                { name: 'Uptime', value: `\`${days}\` Days \`${hours}\` Hours \`${minutes}\` Minutes \`${seconds}\` Seconds`, inline: false },
                { name: 'Discord JS', value: `v${version}`, inline: true },
                { name: 'Node Version', value: process.versions.node, inline: true },
                { name: 'OS Version', value: `${platform} [${architecture}]`, inline: true },
                { name: 'CPU Usage', value: `${cpuUsage}`, inline: true },
                { name: 'RAM Usage', value: `${botUsed}`, inline: true },
                { name: 'Cores', value: `${cores}`, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};