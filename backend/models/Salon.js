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
    stylists: [
        {
            name: { type: String, required: true },
            image: { type: String, required: false }, // Assuming this will be a URL or path to the image
        }
    ],
    openingTime: { type: String, default: "" },     // Optional
    closingTime: { type: String, default: "" },     // Optional
    services: [
        {
            name: { type: String, required: true },
            time: { type: String, required: true },   // Time in a string format like "1 hour" or "30 mins"
            price: { type: Number, required: true },  // Price as a number
        }
    ],
}, { timestamps: true });

// Check if the model is already defined to avoid overwriting
const Salon = mongoose.models.Salon || mongoose.model('Salon', salonSchema);

module.exports = Salon;
