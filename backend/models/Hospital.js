const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name:       { type: String, required: true, trim: true },
    city:       { type: String },
    state:      { type: String },
    address:    { type: String },
    speciality: [{ type: String }],
    contact:    {
        email: String,
        phone: String,
    },
    rating:     { type: Number, default: 0 },
    verified:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
