const { model, Schema } = require('mongoose');

const warnSchema = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

warnSchema.index({ guildId: 1, userId: 1 });

module.exports = model('Warn', warnSchema);