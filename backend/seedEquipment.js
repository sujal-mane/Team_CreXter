const mongoose = require('mongoose');
require('dotenv').config();
const Equipment = require('./models/Equipment');
const MovementHistory = require('./models/MovementHistory');

const LOCATIONS = ['Emergency Room', 'ICU', 'Ward A', 'Ward B', 'Corridor', 'Radiology'];

const devices = [
    { device_id: 'WC101', equipment_type: 'Wheelchair',       location: LOCATIONS[0], status: 'Available', battery_level: 92 },
    { device_id: 'WC102', equipment_type: 'Wheelchair',       location: LOCATIONS[2], status: 'In Use',    battery_level: 78 },
    { device_id: 'ST201', equipment_type: 'Stretcher',        location: LOCATIONS[1], status: 'In Use',    battery_level: 85 },
    { device_id: 'ST202', equipment_type: 'Stretcher',        location: LOCATIONS[3], status: 'Available', battery_level: 64 },
    { device_id: 'OC301', equipment_type: 'Oxygen Cylinder',  location: LOCATIONS[0], status: 'In Use',    battery_level: 100 },
    { device_id: 'IV401', equipment_type: 'IV Stand',         location: LOCATIONS[4], status: 'Available', battery_level: 55 },
];

async function seedEquipment() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Equipment.deleteMany({});
        await MovementHistory.deleteMany({});
        console.log('Cleared existing equipment & history');

        await Equipment.insertMany(devices);
        console.log(`Seeded ${devices.length} equipment devices`);

        await mongoose.disconnect();
        console.log('Done');
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
}

seedEquipment();
