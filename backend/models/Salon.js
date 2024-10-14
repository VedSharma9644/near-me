const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true }, // Add ownerName field
    numberOfStylists: { type: Number, required: true }, // Add numberOfStylists
    openingTime: { type: String, required: true }, // Add openingTime
    closingTime: { type: String, required: true }, // Add closingTime
    services: { type: [String], required: true }, // Add services array
    username: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

const Salon = mongoose.model('Salon', salonSchema);

module.exports = Salon;
