const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  salonId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Salon', 
    required: true 
  },
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  stylistId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Stylist' // Optional field; can be left out if not assigned
  },
  appointmentDate: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, // Holds the appointment time
    required: true 
  },
  customerName: { 
    type: String, // Added field for customer's name
    required: true // Make this required if you always want a name
  },
  customerPhone: { 
    type: String, // Added field for customer's phone number
    required: true // Make this required if you always want a phone number
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Rejected'], 
    default: 'Pending' // Keeps default status as Pending
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
