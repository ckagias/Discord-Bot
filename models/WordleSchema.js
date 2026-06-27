const { model, Schema } = require('mongoose');

const wordleSchema = new Schema({
    userId:   { type: String, required: true },
    date:     { type: String, required: true }, // YYYY-MM-DD
    guesses:  { type: [String], default: [] },  // up to 6 guesses
    won:      { type: Boolean, default: false },
    finished: { type: Boolean, default: false },
});

wordleSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = model('Wordle', wordleSchema);
