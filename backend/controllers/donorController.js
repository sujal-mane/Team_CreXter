const Donor = require('../models/Donor');

exports.registerDonor = async (req, res) => {
    try {
        const donor = await Donor.create(req.body);
        res.status(201).json(donor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 });
        res.json(donors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDonorById = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        res.json(donor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateDonorStatus = async (req, res) => {
    try {
        const { status, approvalDetails } = req.body;
        const update = { status };
        if (approvalDetails) update.approvalDetails = approvalDetails;
        const donor = await Donor.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        res.json(donor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTracking = async (req, res) => {
    try {
        const { stageIndex, notes } = req.body;
        const donor = await Donor.findById(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        if (donor.tracking && donor.tracking.stages && donor.tracking.stages[stageIndex]) {
            donor.tracking.stages[stageIndex].status = 'completed';
            donor.tracking.stages[stageIndex].timestamp = new Date();
            donor.tracking.stages[stageIndex].note = notes || '';
        }
        await donor.save();
        res.json(donor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.searchDonor = async (req, res) => {
    try {
        const { email, phone } = req.query;
        const query = {};
        if (email) query.email = email.toLowerCase();
        if (phone) query.phone = phone;
        const donor = await Donor.findOne(query);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        res.json(donor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
