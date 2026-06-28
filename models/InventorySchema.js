const { model, Schema } = require('mongoose');

const inventorySchema = new Schema({
    userId:  { type: String, required: true },
    guildId: { type: String, required: true },
    items: {
        type: [{
            _id:        false,
            itemId:     { type: String, required: true },
            name:       { type: String, required: true },
            type:       { type: String, required: true },
            emoji:      { type: String, default: null },
            acquiredAt: { type: Date, default: Date.now },
        }],
        default: [],
    },
});

inventorySchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = model('Inventory', inventorySchema);
