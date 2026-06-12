const { model, Schema } = require('mongoose');

const levelSchema = new Schema({
    // Snowflakes stored as strings — exceed JS safe integer limit
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    lastXpAt: { type: Date, default: null },
});

levelSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = model('Level', levelSchema);