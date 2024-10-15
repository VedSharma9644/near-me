const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerMobile: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Unique email for each user
    password: { type: String, required: true }, // Store the password securely (hashed)
    state: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
    numberOfStylists: { type: Number, default: 0 }, // Default value set to 0
    openingTime: { type: String, default: '' }, // Optional field
    closingTime: { type: String, default: '' }, // Optional field
    services: { type: [String], default: [] }, // Array of services offered
    createdAt: { type: Date, default: Date.now }, // Auto-set created date
    updatedAt: { type: Date, default: Date.now } // Auto-set updated date
});

// Middleware to update the 'updatedAt' field before each save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
