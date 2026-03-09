const Equipment = require('../models/Equipment');
const MovementHistory = require('../models/MovementHistory');

const LOCATIONS = [
    'Emergency Room',
    'ICU',
    'Ward A',
    'Ward B',
    'Corridor',
    'Radiology',
];

function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startSimulator() {
    console.log('[BLE Simulator] Starting beacon simulation...');

    async function tick() {
        try {
            const devices = await Equipment.find();
            if (devices.length === 0) return;

            // Pick a random device
            const device = devices[Math.floor(Math.random() * devices.length)];

            // Pick a different location
            const otherLocations = LOCATIONS.filter(l => l !== device.location);
            const newLocation = otherLocations[Math.floor(Math.random() * otherLocations.length)];

            const previousLocation = device.location;
            const signalStrength = Math.floor(Math.random() * -30) - 50; // -50 to -80 dBm

            // Simulate battery drain (0–2% per move)
            const batteryDrain = Math.floor(Math.random() * 3);
            const newBattery = Math.max(0, device.battery_level - batteryDrain);

            // Update equipment
            device.location = newLocation;
            device.battery_level = newBattery;
            device.last_updated = new Date();
            await device.save();

            // Record movement history
            await MovementHistory.create({
                device_id: device.device_id,
                previous_location: previousLocation,
                new_location: newLocation,
                signal_strength: signalStrength,
                timestamp: new Date(),
            });

            const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            console.log(`[BLE Simulator] ${time} – ${device.device_id} moved from ${previousLocation} → ${newLocation} (signal: ${signalStrength} dBm, battery: ${newBattery}%)`);
        } catch (err) {
            console.error('[BLE Simulator] Error:', err.message);
        }

        // Schedule next tick at random 5–8 second interval
        setTimeout(tick, randomInterval(5000, 8000));
    }

    // Start first tick after a short delay
    setTimeout(tick, 2000);
}

module.exports = startSimulator;
