// 'model' turns our schema definition into a full Mongoose model we can query against
// 'Schema' lets us define the shape and rules for documents in this collection
const { model, Schema } = require('mongoose');

// This schema stores AFK status for individual users.
// When a user sets themselves as AFK, a document is created here.
// When they return (send a message), the document is deleted.
const afkSchema = new Schema({
    // The Discord user ID of the AFK user — stored as String because snowflakes exceed JS safe integer limit
    userId: { type: String, required: true },
    // The Discord server ID — AFK status is per-server, not global
    guildId: { type: String, required: true },
    // Optional message explaining why the user is AFK (e.g. "eating lunch")
    reason: { type: String, default: 'No reason provided' },
    // The timestamp when the user set their AFK status, used to calculate how long they were away
    since: { type: Date, default: Date.now },
});

// Compound index so we can efficiently look up a specific user in a specific server
afkSchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Register the schema as a Mongoose model called 'Afk'
// Mongoose will automatically create (or reuse) an 'afks' collection in MongoDB
module.exports = model('Afk', afkSchema);
