const express = require('express');
const router = express.Router();
const Appointment = require('../../models/appointments/appointment');
const stylistRoutes = require('./stylistAppointmentRoutes'); // Adjust the path if necessary
const servicesRoutes = require('./servicesAppointmentRoutes'); // Adjusted path

// Use the stylist routes
router.use('/stylists', stylistRoutes);

// Use the services routes
router.use('/services', servicesRoutes);

// Create a new appointment
// Create a new appointment
router.post('/', async (req, res) => {
    try {
      const appointment = new Appointment(req.body);
      await appointment.save();
      res.status(201).send(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error); // Log the error details
      res.status(400).send({ message: 'Error creating appointment', error: error.message }); // Send back error message
    }
  });
  

// Get appointments for a specific salon
router.get('/salon/:salonId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ salonId: req.params.salonId });
    res.send(appointments);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching appointments', error: error.message });
  }
});

// Update appointment status
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(appointment);
  } catch (error) {
    res.status(400).send({ message: 'Error updating appointment', error: error.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).send({ message: 'Error deleting appointment', error: error.message });
  }
});

module.exports = router;
