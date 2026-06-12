const { model, Schema } = require('mongoose');

const guildSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    // Off by default until an admin enables it
    levelingEnabled: { type: Boolean, default: false },
});

module.exports = model('Guild', guildSchema);