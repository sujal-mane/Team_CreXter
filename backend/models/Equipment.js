const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    device_id:      { type: String, required: true, unique: true, trim: true },
    equipment_type: { type: String, required: true, trim: true },
    location:       { type: String, required: true },
    status:         { type: String, enum: ['Available', 'In Use', 'Maintenance'], default: 'Available' },
    battery_level:  { type: Number, min: 0, max: 100, default: 100 },
    last_updated:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('Equipment', equipmentSchema);
