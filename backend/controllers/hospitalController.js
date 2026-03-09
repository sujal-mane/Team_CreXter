const Hospital = require('../models/Hospital');

exports.getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().sort({ rating: -1 });
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createHospital = async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
