const { model, Schema } = require('mongoose');

const reactionRoleSchema = new Schema({
    guildId: { type: String, required: true },
    messageId: { type: String, required: true },
    emoji: { type: String, required: true },
    roleId: { type: String, required: true },
});

reactionRoleSchema.index({ guildId: 1, messageId: 1, emoji: 1 });

module.exports = model('ReactionRole', reactionRoleSchema);