const mongoose = require('mongoose');

const salonAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This field is required
  },
  email: {
    type: String,
    required: true,
    unique: true, // Each email must be unique
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  phoneNumber: {
    type: String,
    required: false, // This field is optional
  },
  salonName: {
    type: String,
    required: true,
  },
  // Add more fields as necessary
});

// Create the model from the schema
const SalonAdmin = mongoose.model('SalonAdmin', salonAdminSchema);

module.exports = SalonAdmin; // Export the model for use in other files
