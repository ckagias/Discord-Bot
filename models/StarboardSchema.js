const { model, Schema } = require('mongoose');

const starboardSchema = new Schema({
    guildId:            { type: String, required: true },
    channelId:          { type: String, required: true }, // original message's channel
    messageId:          { type: String, required: true }, // original message id
    starboardMessageId: { type: String, required: true }, // posted embed in the starboard channel
    starCount:          { type: Number, default: 0 },
});

starboardSchema.index({ guildId: 1, messageId: 1 });

module.exports = model('Starboard', starboardSchema);
