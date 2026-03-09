const mongoose = require('mongoose');

const movementHistorySchema = new mongoose.Schema({
    device_id:         { type: String, required: true },
    previous_location: { type: String, required: true },
    new_location:      { type: String, required: true },
    signal_strength:   { type: Number },
    timestamp:         { type: Date, default: Date.now },
});

movementHistorySchema.index({ timestamp: -1 });

module.exports = mongoose.model('MovementHistory', movementHistorySchema);
