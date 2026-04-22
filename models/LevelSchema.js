// 'model' turns our schema definition into a full Mongoose model we can query against
// 'Schema' lets us define the shape and rules for documents in this collection
const { model, Schema } = require('mongoose');

// This schema tracks XP and level for every individual user, per server.
// The combination of userId + guildId is unique, so the same user can have different levels across different servers.
const levelSchema = new Schema({
    // Discord user ID (snowflake) — stored as a String because Discord snowflakes exceed JavaScript's safe integer limit
    userId: { type: String, required: true },
    // Discord server ID (snowflake) — stored as a String for the same reason as userId above
    guildId: { type: String, required: true },
    // Running total of XP the user has earned in this server since their last level-up
    xp: { type: Number, default: 0 },
    // The user's current level in this server — starts at 0 for all new members
    level: { type: Number, default: 0 },
});

// Compound index so MongoDB can look up a specific user in a specific server in O(log n) instead of scanning the whole collection
// 'unique: true' also prevents duplicate records for the same user + server combination
levelSchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Register the schema as a Mongoose model called 'Level'
// Mongoose will automatically create (or reuse) a 'levels' collection in MongoDB
module.exports = model('Level', levelSchema);