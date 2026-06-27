const { model, Schema } = require('mongoose');

const hangmanSchema = new Schema({
    messageId: { type: String, required: true, unique: true },
    userId:    { type: String, required: true },
    guildId:   { type: String, required: true },
    word:      { type: String, required: true },
    guessed:   { type: [String], default: [] },
    wrong:     { type: Number, default: 0 },
    finished:  { type: Boolean, default: false },
    won:       { type: Boolean, default: false },
});

module.exports = model('Hangman', hangmanSchema);
