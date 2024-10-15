const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerMobile: { type: String, required: true }, // Added for future use
    state: { type: String, required: true },       // Dropdown field
    city: { type: String, required: true },        // Dropdown field
    area: { type: String, required: true },
    pincode: { type: String, required: true },
    email: { type: String, required: true },       // Added for registration
    password: { type: String, required: true },
    numberOfStylists: { type: Number, default: 0 }, // Optional fields for future updates
    openingTime: { type: String, default: "" },     // Optional
    closingTime: { type: String, default: "" },     // Optional
    services: { type: [String], default: [] },      // Optional array for services
}, { timestamps: true });

const Salon = mongoose.model('Salon', salonSchema);
module.exports = Salon;
