const Ngo = require('../models/NGO');

exports.getAllNgos = async (req, res) => {
    try {
        const ngos = await Ngo.find().sort({ rating: -1 });
        res.json(ngos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNgoById = async (req, res) => {
    try {
        const ngo = await Ngo.findById(req.params.id);
        if (!ngo) return res.status(404).json({ message: 'NGO not found' });
        res.json(ngo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createNgo = async (req, res) => {
    try {
        const ngo = await Ngo.create(req.body);
        res.status(201).json(ngo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateNgo = async (req, res) => {
    try {
        const ngo = await Ngo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ngo) return res.status(404).json({ message: 'NGO not found' });
        res.json(ngo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
