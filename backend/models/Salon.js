const mongoose = require('mongoose');

// Updated salon schema
const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },         // Salon name
    ownerName: { type: String, required: true },    // Owner name
    numberOfStylists: { type: Number, required: true }, // Number of stylists
    openingTime: { type: String, required: true },   // Opening time (you can change type if needed)
    closingTime: { type: String, required: true },   // Closing time (you can change type if needed)
    services: { type: [String], required: true },    // Array of services
    username: { type: String, required: true },      // Username
    password: { type: String, required: true },      // Password
}, { timestamps: true });

const Salon = mongoose.model('Salon', salonSchema);

module.exports = Salon;
