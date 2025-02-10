// backend/routes/appointments/fetchAppointmentsRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../../models/appointments/appointment');
const Salon = require('../../models/Salon'); // Import the Salon model


router.get('/salon/:salonId', async (req, res) => {
  try {
    const { salonId } = req.params;

    // Fetch the salon document to get the stylists array
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).send({ message: 'Salon not found' });
    }

    // Fetch all appointments for the salon
    const appointments = await Appointment.find({ salonId })
      .populate('customerId', 'name phone')  // Customer name and phone
      .populate('serviceId', 'name price')  // Service name and price
      .sort({ appointmentDate: 1, time: 1 }); // Sort by appointment date and time

    // Enrich appointments with stylist details
    const enrichedAppointments = appointments.map((appointment) => {
      const stylist = salon.stylists.find(
        (stylist) => stylist._id.toString() === appointment.stylistId.toString()
      );
    
      console.log('Stylist Lookup:', stylist); // This should log the stylist object or null if not found
      
      return {
        ...appointment.toObject(),
        stylistName: stylist ? stylist.name : 'Unknown Stylist',
        stylistImage: stylist ? stylist.image : null,
      };
    });
        

    // Send the enriched appointments data
    res.status(200).send(enrichedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send({ message: 'Error fetching appointments', error: error.message });
  }
});

module.exports = router;
