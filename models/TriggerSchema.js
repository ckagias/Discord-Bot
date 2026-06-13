const { model, Schema } = require('mongoose');

const triggerSchema = new Schema({
    guildId: { type: String, required: true },
    trigger: { type: String, required: true },
    response: { type: String, required: true },
});

triggerSchema.index({ guildId: 1 });

module.exports = model('Trigger', triggerSchema);