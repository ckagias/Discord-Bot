const { model, Schema } = require('mongoose');

const afkSchema = new Schema({
    // Snowflakes stored as strings — exceed JS safe integer limit
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, default: 'No reason provided' },
    since: { type: Date, default: Date.now },
});

afkSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = model('Afk', afkSchema);