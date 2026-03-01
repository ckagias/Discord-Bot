// 'axios' is a library used to make HTTP requests (like fetching data from an API)
const axios = require('axios');
// Import the necessary discord.js tools:
// ActionRowBuilder - wraps components like buttons or menus into a row
// StringSelectMenuBuilder - creates a dropdown select menu
// ComponentType - used to identify what type of component the user interacted with
// MessageFlags - used to send ephemeral (only visible to one user) messages
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MessageFlags } = require('discord.js');

module.exports = {
    // Define the slash command's name, description, and options
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Shows weather for a city (Visible to everyone)')
        // Add a required text option where the user types a city name
        .addStringOption(option =>
            option.setName('location')
                .setDescription('City name (e.g., Athens)')
                .setRequired(true)),

    async execute(interaction) {
        // Get the city name the user typed in the slash command
        const location = interaction.options.getString('location');
        // Get the weather API key from the environment variables (stored securely in .env)
        const apiKey = process.env.WEATHER_API_KEY;

        try {
            // Call the OpenWeatherMap Geocoding API to search for cities matching the typed name
            // This returns up to 5 matching locations with their coordinates
            const geoRes = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=5&appid=${apiKey}`);
      
            // If no cities were found, let the user know and stop
            if (!geoRes.data.length) {
                return interaction.reply('❌ City not found.');
            }

            const places = geoRes.data;

            // If there's only one result, skip the dropdown and show the weather directly
            if (places.length === 1) {
                return await sendWeather(interaction, places[0], apiKey);
            }

            // If there are multiple results, build a dropdown menu so the user can pick the right one
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('weather_select') // Unique ID used to identify this menu later
                .setPlaceholder('📍 Select the correct location...')
                .addOptions(
                    // Create one option per location result
                    places.map((place, index) => ({
                        label: `${place.name}, ${place.state || ''} ${place.country}`.replace('  ', ' '),
                        description: `Lat: ${place.lat.toFixed(2)}, Lon: ${place.lon.toFixed(2)}`, // Show coordinates as extra info
                        value: `${index}`, // Store the index so we know which place was selected
                    }))
                );

            // Wrap the dropdown menu in an action row (Discord requires components to be inside a row)
            const row = new ActionRowBuilder().addComponents(selectMenu);
            // Send the dropdown menu to the user
            const response = await interaction.reply({
                content: `🔍 I found **${places.length}** locations for "${location}". Please choose one:`,
                components: [row]
            });

            // Create a collector that listens for the user's dropdown selection for up to 60 seconds
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

            // This runs every time someone interacts with the dropdown
            collector.on('collect', async i => {
                // Make sure only the user who ran the command can use this dropdown
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: "❌ This menu is not for you!", flags: MessageFlags.Ephemeral });
                }   

                // Get the index of the selected location and find it in the places array
                const selectedIndex = parseInt(i.values[0]);
                const selectedPlace = places[selectedIndex];

                // Fetch and display the weather for the selected location
                await sendWeather(i, selectedPlace, apiKey);
            });

            // This runs when the collector stops (after 60 seconds)
            collector.on('end', collected => {
                // If the user never selected anything, update the message to say time expired
                if (collected.size === 0) {
                    interaction.editReply({ content: '❌ Time expired.', components: [] });
                }
            });

        } catch (err) {
            // If something goes wrong, log the error and notify the user
            console.error(err);
            if (!interaction.replied) {
                await interaction.reply('❌ Error fetching weather data.');
            }
        }
    }
};

// This function fetches the actual weather data and sends it as an embed
async function sendWeather(interaction, place, apiKey) {
    try {
        // Destructure the coordinates, city name, country, and state from the selected place
        const { lat, lon, name, country, state } = place;
        // Call the OpenWeatherMap Weather API using the coordinates from the geocoding step 
        // units=metric returns temperatures in Celsius
        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`);
        const weather = weatherRes.data;
        // Build a readable location string, including the state if it exists
        const locationString = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;

        const embed = new EmbedBuilder()
            .setTitle(`☁️ Weather in ${locationString}`)
            .setDescription(
                `🌡️ Temperature: **${Math.round(weather.main.temp)}°C**\n` +
                `💧 Humidity: **${weather.main.humidity}%**\n` +
                `🌬️ Wind: **${weather.wind.speed} km/h**\n` +
                `🌥️ Description: **${weather.weather[0].description}**`
            )
            .setColor(Math.floor(Math.random() * 0xFFFFFF)) // Random color in hex
            // Use the weather icon from OpenWeatherMap as the embed thumbnail
            .setThumbnail(`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
            // Show who requested the command in the footer
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

            // If this was triggered by the dropdown menu, update the existing message instead of sending a new one
            if (interaction.isStringSelectMenu()) {
                await interaction.update({ content: null, embeds: [embed], components: [] });
            } else {
                // Otherwise, just reply normally
                await interaction.reply({ embeds: [embed] });
            }
    } catch (error) {
        console.error(error);
        await interaction.followUp('❌ Failed to load weather details.');
    }
}