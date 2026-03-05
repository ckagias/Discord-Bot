// 'model' turns our schema definition into a full Mongoose model we can query against
// 'Schema' lets us define the shape and rules for documents in this collection
const { model, Schema } = require('mongoose');

// This schema stores server-wide settings.
// Right now it only tracks whether leveling is enabled, but you can add more server settings here in the future (e.g. levelUpChannel, multipliers, etc.)
const guildSchema = new Schema({
    // The Discord server (guild) ID — stored as a String because Discord snowflakes exceed JavaScript's safe integer limit
    // 'unique: true' ensures we never accidentally create two records for the same server
    guildId: { type: String, required: true, unique: true },
    // Leveling is OFF by default until an admin explicitly enables it with a command
    levelingEnabled: { type: Boolean, default: false },
});

// Register the schema as a Mongoose model called 'Guild'
// Mongoose will automatically create (or reuse) a 'guilds' collection in MongoDB
module.exports = model('Guild', guildSchema);