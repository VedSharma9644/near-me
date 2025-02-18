const mongoose = require('mongoose');
const moment = require('moment');

const serviceDetailSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  serviceName: { type: String, required: true },
  serviceDuration: { type: Number, required: true }, // Duration in minutes
  servicePrice: { type: Number, required: true }     // Price in currency
});

const appointmentSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, required: true },
  appointmentDate: { type: Date, required: true },
  time: { type: Number, required: true },
  serviceDetails: [serviceDetailSchema],
  totalServiceDuration: { type: Number, required: true },  // New field to store total duration
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  stylistId: { type: mongoose.Schema.Types.ObjectId, required: true },
  stylistName: { type: String, required: true },  // Add stylistName directly in the schema
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
