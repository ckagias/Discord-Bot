// 'fs' lets us read files and folders on the computer
const fs = require('fs');
// 'path' helps us build file paths that work on any operating system
const path = require('path');

// This function is called from index.js and receives the bot client as a parameter
module.exports = (client) => {
    // Build the path to the events folder
    const eventsPath = path.join(__dirname, `../events`);
    // Get all .js files inside the events folder — each file handles one event
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    // Loop through each event file and register it on the client
    for (const file of eventFiles) {
        // Load the event file
        const event = require(path.join(eventsPath, file));

        // If the event has 'once: true', register it with client.once() so it only fires one time
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client)); 
        }
        // Otherwise register it with client.on() so it fires every time the event occurs
        else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};