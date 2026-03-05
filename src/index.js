// Import Client to create the bot instance, and GatewayIntentBits to specify which events Discord should send us
const { Client, GatewayIntentBits } = require('discord.js');
// Import mongoose to connect to and interact with the MongoDB database
const mongoose = require('mongoose');
// Load environment variables from the .env file (e.g. bot token, MongoDB URL)
require('dotenv').config({ debug: false });
// Import the built-in DNS module to override the default DNS servers
const dns = require('node:dns');
// Use Cloudflare's DNS servers instead of the system default — improves reliability for MongoDB Atlas connections
dns.setServers(["1.1.1.1", "1.0.0.1"]);

// Create the bot client and declare which gateway intents (event types) it needs access to
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,            // Basic server info and events
        GatewayIntentBits.GuildMessages,     // Receive messages sent in servers
        GatewayIntentBits.GuildMembers,      // Access member join/leave events and member data
        GatewayIntentBits.GuildPresences,    // Read member presence/status updates
        GatewayIntentBits.GuildMessageReactions, // Receive message reaction events
        GatewayIntentBits.MessageContent,    // Read the actual text content of messages (privileged intent)
    ],
});

// Wrap startup in an async IIFE so we can await the DB connection before the bot starts handling events
(async () => {
    try {
        // Connect to MongoDB — if this fails, the bot shouldn't start at all
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1); // Exit — the bot is useless without a database
    }

    // Load event listeners (messageCreate, interactionCreate, clientReady, etc.)
    require('../handlers/eventHandler')(client);

    // Load slash commands into the client.commands Map so interactionCreate can look them up by name
    require('../handlers/slashCommandHandler')(client);

    // Log the bot into Discord using the token from the .env file
    await client.login(process.env.Token);
})();