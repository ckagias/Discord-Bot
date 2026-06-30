const { model, Schema } = require('mongoose');

const blackjackSchema = new Schema({
    messageId:      { type: String, required: true, unique: true },
    userId:         { type: String, required: true },
    guildId:        { type: String, required: true },
    bet:            { type: Number, required: true },
    deck:           { type: [String], required: true },
    playerHand:     { type: [String], required: true },
    dealerHand:     { type: [String], required: true },
    finished:       { type: Boolean, default: false },
    createdAt:      { type: Date, default: Date.now },
    // PvP fields
    opponentId:     { type: String, default: null },
    opponentHand:   { type: [String], default: [] },
    opponentBet:    { type: Number, default: 0 },
    opponentDone:   { type: Boolean, default: false },
    opponentDeck:   { type: [String], default: [] }, // opponent draws from same deck position
});

// Auto-delete abandoned games after 7 days so stale PvP bets don't sit forever
blackjackSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = model('Blackjack', blackjackSchema);
