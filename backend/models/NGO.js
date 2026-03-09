const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    name:          { type: String, required: true, trim: true },
    logo:          { type: String },
    focus:         { type: String },
    rating:        { type: Number, default: 0 },
    campaigns:     { type: Number, default: 0 },
    beneficiaries: { type: Number, default: 0 },
    verified:      { type: Boolean, default: false },
    contact:       {
        email: String,
        phone: String,
        website: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Ngo', ngoSchema);
