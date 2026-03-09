const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const startSimulator = require('./simulator/bleSimulator');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/history', require('./routes/history'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'HelpLink API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start BLE beacon simulator
    startSimulator();
});
