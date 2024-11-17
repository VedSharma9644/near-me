// backend/routes/appointments/fetchAppointmentsRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../../models/appointments/appointment');

// Get all appointments for a specific salon
router.get('/salon/:salonId', async (req, res) => {
  try {
    const { salonId } = req.params;
    const appointments = await Appointment.find({ salonId });
    res.send(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send({ message: 'Error fetching appointments', error: error.message });
  }
});

module.exports = router;
