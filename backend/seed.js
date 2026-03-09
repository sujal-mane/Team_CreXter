const mongoose = require('mongoose');
require('dotenv').config();
const Ngo = require('./models/NGO');

const ngos = [
    { name: "MOHAN Foundation", focus: "Organ Donation Awareness", verified: true, campaigns: 52, beneficiaries: 45000, logo: "🫀", rating: 4.9 },
    { name: "NOTTO (Govt. of India)", focus: "Organ & Tissue Transplant", verified: true, campaigns: 68, beneficiaries: 72000, logo: "🏛️", rating: 5.0 },
    { name: "Donate Life India", focus: "Organ Donor Registry", verified: true, campaigns: 34, beneficiaries: 28000, logo: "💚", rating: 4.8 },
    { name: "Shatayu Foundation", focus: "Kidney & Liver Donation", verified: true, campaigns: 22, beneficiaries: 15600, logo: "🫘", rating: 4.7 },
    { name: "Gift of Life Trust", focus: "Cornea & Eye Donation", verified: true, campaigns: 19, beneficiaries: 21000, logo: "👁️", rating: 4.8 },
    { name: "Marrow Donor Registry India", focus: "Bone Marrow Donation", verified: true, campaigns: 16, beneficiaries: 9400, logo: "🦴", rating: 4.6 },
    { name: "Zonal Transplant Coordination Centre", focus: "Multi-Organ Transplant", verified: true, campaigns: 41, beneficiaries: 35000, logo: "🏥", rating: 4.9 },
    { name: "Cadaver Organ Retrieval Network", focus: "Posthumous Organ Retrieval", verified: true, campaigns: 30, beneficiaries: 18500, logo: "🕊️", rating: 4.7 },
    { name: "iKidney Foundation", focus: "Kidney Disease & Transplant", verified: false, campaigns: 12, beneficiaries: 6800, logo: "🩺", rating: 4.5 },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Ngo.deleteMany({});
        console.log('Cleared existing NGOs');

        await Ngo.insertMany(ngos);
        console.log(`Seeded ${ngos.length} NGOs`);

        await mongoose.disconnect();
        console.log('Done');
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
