const { model, Schema } = require('mongoose');

const ticketSchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    ticketNumber: { type: Number, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
});

ticketSchema.index({ guildId: 1, ticketNumber: 1 });

module.exports = model('Ticket', ticketSchema);