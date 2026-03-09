const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    fullName:          { type: String, required: true, trim: true },
    email:             { type: String, required: true, trim: true },
    phone:             { type: String, required: true },
    dob:               { type: String },
    gender:            { type: String, enum: ['male', 'female', 'other'] },
    bloodGroup:        { type: String, required: true },
    address:           { type: String },
    city:              { type: String },
    state:             { type: String },
    pincode:           { type: String },
    organs:            [{ type: Number }],
    donationType:      { type: String, enum: ['living', 'posthumous', 'both'] },
    medicalConditions: { type: String, default: '' },
    smoking:           { type: String },
    alcohol:           { type: String },
    chronicDisease:    { type: String },
    previousSurgery:   { type: String },
    emergencyName:     { type: String },
    emergencyPhone:    { type: String },
    status:            { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvalDetails:   {
        donationDate: String,
        donationTime: String,
        hospital:     String,
        doctor:       String,
    },
    tracking: {
        stages: [{
            name:      String,
            status:    { type: String, default: 'pending' },
            timestamp: Date,
            note:      String,
            location:  String,
        }],
    },
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);
