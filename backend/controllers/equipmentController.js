const Equipment = require('../models/Equipment');
const MovementHistory = require('../models/MovementHistory');

// GET /api/equipment
exports.getAllEquipment = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search
            ? { device_id: { $regex: search, $options: 'i' } }
            : {};
        const equipment = await Equipment.find(filter).sort({ last_updated: -1 });
        res.json(equipment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/equipment/:id
exports.getEquipmentById = async (req, res) => {
    try {
        const eq = await Equipment.findOne({ device_id: req.params.id });
        if (!eq) return res.status(404).json({ message: 'Equipment not found' });
        res.json(eq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/equipment/update-location
exports.updateLocation = async (req, res) => {
    try {
        const { device_id, location } = req.body;
        if (!device_id || !location) {
            return res.status(400).json({ message: 'device_id and location are required' });
        }
        const eq = await Equipment.findOne({ device_id });
        if (!eq) return res.status(404).json({ message: 'Equipment not found' });

        const previousLocation = eq.location;
        eq.location = location;
        eq.last_updated = new Date();
        await eq.save();

        // record movement
        if (previousLocation !== location) {
            await MovementHistory.create({
                device_id,
                previous_location: previousLocation,
                new_location: location,
                signal_strength: Math.floor(Math.random() * -30) - 50, // -50 to -80
                timestamp: new Date(),
            });
        }

        res.json(eq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/equipment/:id/status
exports.toggleStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Available', 'In Use', 'Maintenance'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const eq = await Equipment.findOneAndUpdate(
            { device_id: req.params.id },
            { status, last_updated: new Date() },
            { new: true }
        );
        if (!eq) return res.status(404).json({ message: 'Equipment not found' });
        res.json(eq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/history
exports.getMovementHistory = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 200);
        const history = await MovementHistory.find()
            .sort({ timestamp: -1 })
            .limit(limit);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
