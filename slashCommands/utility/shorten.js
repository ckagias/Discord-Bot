// Import SlashCommandBuilder to create a slash command
const { SlashCommandBuilder } = require('discord.js');
// 'axios' is a library used to make HTTP requests (like fetching data from an API)
const axios = require('axios');

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
        .setName('shorten')
        .setDescription('Shortens a URL using is.gd.')
        // Add a required text option where the user pastes the URL they want shortened
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL you want to shorten')
                .setRequired(true)),

    async execute(interaction) {
        // Get the URL the user typed in the slash command
        const url = interaction.options.getString('url');

        // Basic URL validation
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch {
            // If new URL() throws, the input is not a valid URL at all
            return interaction.reply({
                content: '❌ That doesn\'t look like a valid URL. Make sure to include `http://` or `https://`.',
                ephemeral: true,
            });
        }

        // Reject non-http(s) protocols (e.g. ftp://, javascript:, etc.)
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return interaction.reply({
                content: '❌ Only `http` and `https` URLs are supported.',
                ephemeral: true,
            });
        }

        // Defer the reply so we have time to call the API without Discord timing out
        await interaction.deferReply();

        try {
            // Call the is.gd API to shorten the URL, requesting a JSON response
            const response = await axios.get('https://is.gd/create.php', {
                params: {
                    format: 'json',
                    url: url,
                },
            });

            // Extract the shortened URL from the API response
            const shortUrl = response.data.shorturl;

            // If the API returned no shortened URL, something went wrong on their side
            if (!shortUrl) {
                return interaction.editReply('❌ Failed to shorten the URL. The service may have rejected it.');
            }

            await interaction.editReply(
                `🔗 Here's your shortened URL:\n**${shortUrl}**\n\n> Original: <${url}>`
            );
        } catch (error) {
            // If the API request fails entirely, log the error and notify the user
            console.error('[shorten] Error:', error);
            await interaction.editReply('❌ Something went wrong while shortening the URL. Please try again later.');
        }
    },
};
