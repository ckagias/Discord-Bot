// Import ActivityType to set what kind of activity the bot is shown as doing (Streaming, Playing, etc.)
const { ActivityType } = require('discord.js');

module.exports = {
    // The name of the event this file listens for — 'clientReady' fires when the bot successfully logs in
    name: `clientReady`,
    // 'once: true' means this event will only trigger one time, not every time it could fire
    once: true,
    execute(client) {
        // Log a message to the console confirming the bot is online and showing its tag
        console.log(`Logged in as ${client.user.tag}`);

        // Set the bot's presence (the status shown under its name in Discord)
        client.user.setPresence({
            activities: [
                // Display the bot as "Streaming Whatever you want"
                {name: 'Whatever you want', type: ActivityType.Streaming}
            ],
        })
    }
};
