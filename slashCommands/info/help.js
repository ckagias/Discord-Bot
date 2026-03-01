// Import SlashCommandBuilder for creating the slash command, EmbedBuilder for fancy messages, and 'version' to get the current discord.js version number
const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
// 'os' gives us information about the computer the bot is running on (CPU, architecture, etc.)
const os = require("os");
// 'outdent' helps with formatting multi-line template strings cleanly
const { outdent } = require("outdent");
// 'moment' is a library for formatting and displaying dates and times easily
const moment = require('moment');

module.exports = {
    // Define the slash command's name and description
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Returns bot's information"),

    async execute(interaction) {
        // Get the bot client from the interaction
        const client = interaction.client;

        // Convert the bot's uptime (in milliseconds) into days, hours, minutes, and seconds
        let seconds = Math.floor(client.uptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        // Use module (%) to get the reminder so each unit doesn't overflow into the next e.g. 90 seconds becomes 1 minute and 30 seconds, not "90 seconds"
        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        // Get the operating system name and replace the internal name "win32" with "Windows"
        const platform = process.platform.replace(/win32/g, "Windows");
        // Get the CPU architecture (e.g. x64, arm)
        const architecture = os.arch();
        // Get the number of CPU cores available on the machine
        const cores = os.cpus().length;
        // Get how much CPU the bot process has used and convert it from bytes to megabytes
        const cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`;

        // Get how much RAM the bot is currently using and convert it from bytes to megabytes
        const botUsed = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;

        let embed = new EmbedBuilder()
            // Show the bot's username and avatar in the author section at the top of the embed
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            // Show the bot's avatar as a thumbnail in the top-right of the embed
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            .addFields(
                { name: 'Name', value: `${client.user.tag}`, inline: true },           // Bot's full tag (name#0000)
                { name: 'ID', value: `${client.user.id}`, inline: true },              // Bot's unique Discord ID
                // Show when the bot account was created, formatted nicely with moment.js
                { name: 'Created At', value: `${moment(client.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(client.user.createdAt).fromNow()})`, inline: false },
                // Show how long the bot has been online since last restart
                { name: 'Uptime', value: `\`${days}\` Days \`${hours}\` Hours \`${minutes}\` Minutes \`${seconds}\` Seconds`, inline: false },
                { name: 'Discord JS', value: `v${version}`, inline: true },            // discord.js library version
                { name: 'Node Version', value: process.versions.node, inline: true },  // Node.js version running the bot
                { name: 'OS Version', value: `${platform} [${architecture}]`, inline: true }, // Operating system and CPU architecture
                { name: 'CPU Usage', value: `${cpuUsage}`, inline: true },             // How much CPU the bot is using
                { name: 'RAM Usage', value: `${botUsed}`, inline: true },              // How much RAM the bot is using
                { name: 'Cores', value: `${cores}`, inline: true }                     // Number of CPU cores on the machine
            )
            // Show who requested the command in the footer
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Send the embed as a reply
        await interaction.reply({ embeds: [embed] });
    }
};