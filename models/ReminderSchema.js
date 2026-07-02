const { model, Schema } = require('mongoose');

const reminderSchema = new Schema({
    userId:     { type: String, required: true },
    guildId:    { type: String, required: true },
    channelId:  { type: String, required: true },
    message:    { type: String, required: true },
    remindAt:   { type: Date, required: true },
    sent:       { type: Boolean, default: false },
});

reminderSchema.index({ sent: 1, remindAt: 1 });

module.exports = model('Reminder', reminderSchema);
