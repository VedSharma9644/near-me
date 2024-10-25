const mongoose = require('mongoose');

// Service Schema
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true, // e.g., "30 mins"
  },
});

// Stylist Schema
const stylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  experience: {
    type: Number, // Optional: e.g., years of experience
  },
  // Add more fields for stylists as needed
});

// Salon Admin Schema
const salonAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salonName: {
    type: String,
    required: true,
  },
  openingTime: {
    type: String, // e.g., "9:00 AM"
  },
  closingTime: {
    type: String, // e.g., "9:00 PM"
  },
  stylists: [stylistSchema], // Array of stylists
  services: [serviceSchema], // Array of services
  salonImages: {
    type: [String], // Array of image URLs or file paths
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  area: {
    type: String,
  },
  pincode: {
    type: String,
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const SalonAdmin = mongoose.model('SalonAdmin', salonAdminSchema);

module.exports = SalonAdmin;
