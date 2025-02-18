const express = require('express');
const router = express.Router();
const Appointment = require('../../models/appointments/appointment');
const stylistRoutes = require('./stylistAppointmentRoutes');
const servicesRoutes = require('./servicesAppointmentRoutes');
const moment = require('moment');
const mongoose = require('mongoose');
const Salon = require('../../models/Salon');

// Use the stylist routes
router.use('/stylists', stylistRoutes);

// Use the services routes
router.use('/services', servicesRoutes);

// Utility function to check slot availability
const checkSlotAvailability = async (salonId, appointmentDate, selectedTimeInMinutes, totalServiceDuration, stylistId) => {
  try {
    console.log("Checking availability for:");
    console.log(`Salon ID: ${salonId}`);
    console.log(`Date: ${appointmentDate}`);
    console.log(`Selected Time (minutes): ${selectedTimeInMinutes}`);
    console.log(`Total Service Duration: ${totalServiceDuration}`);
    console.log(`Stylist ID: ${stylistId}`);

    const salon = await Salon.findById(salonId);
    if (!salon) {
      console.error("Salon not found");
      throw new Error("Salon not found");
    }

    // Salon hours
    const openingTimeInMinutes =
      moment(salon.openingTime, 'hh:mm A').hours() * 60 +
      moment(salon.openingTime, 'hh:mm A').minutes();
    const closingTimeInMinutes =
      moment(salon.closingTime, 'hh:mm A').hours() * 60 +
      moment(salon.closingTime, 'hh:mm A').minutes();

    console.log(`Salon Working Hours: ${salon.openingTime} (${openingTimeInMinutes} minutes) - ${salon.closingTime} (${closingTimeInMinutes} minutes)`);

    // Check if the selected time is within working hours
    if (
      selectedTimeInMinutes < openingTimeInMinutes ||
      selectedTimeInMinutes + totalServiceDuration > closingTimeInMinutes
    ) {
      console.warn("Selected time is outside working hours");
      return { available: false, message: "Selected time is outside the salon's working hours." };
    }

    // Get all appointments for the given date, stylist, and salon
    const appointments = await Appointment.find({
      salonId,
      stylistId,
      appointmentDate,
    }).sort({ time: 1 });

    console.log(`Total Appointments Found: ${appointments.length}`);
    if (appointments.length > 0) {
      console.log("Appointments on the same date:");
      appointments.forEach((appt, index) => {
        console.log(
          `  Appointment ${index + 1}: Start - ${appt.time} mins, Duration - ${appt.totalServiceDuration} mins, End - ${
            appt.time + appt.totalServiceDuration
          } mins`
        );
      });
    }

    let nextAvailableTime = selectedTimeInMinutes;
    let isAvailable = true;

    // Check for overlaps with existing appointments
    for (const appointment of appointments) {
      const appointmentStartTime = appointment.time;
      const appointmentEndTime = appointment.time + appointment.totalServiceDuration;

      console.log(`Checking against appointment: Start - ${appointmentStartTime} mins, End - ${appointmentEndTime} mins`);

      if (
        (selectedTimeInMinutes < appointmentEndTime && selectedTimeInMinutes >= appointmentStartTime) || // Overlaps at the start
        (selectedTimeInMinutes + totalServiceDuration > appointmentStartTime && selectedTimeInMinutes + totalServiceDuration <= appointmentEndTime) || // Overlaps at the end
        (selectedTimeInMinutes <= appointmentStartTime && selectedTimeInMinutes + totalServiceDuration >= appointmentEndTime) // Completely overlaps
      ) {
        console.warn(
          `Conflict found! Selected slot (${selectedTimeInMinutes} - ${
            selectedTimeInMinutes + totalServiceDuration
          }) overlaps with appointment (${appointmentStartTime} - ${appointmentEndTime})`
        );
        isAvailable = false;
        nextAvailableTime = Math.max(nextAvailableTime, appointmentEndTime); // Push to next available time
      }
    }

    console.log(`Next Available Time (minutes): ${nextAvailableTime}`);
    console.log(
      `Converted Next Available Time: ${moment
        .utc()
        .startOf('day')
        .add(nextAvailableTime, 'minutes')
        .format('hh:mm A')}`
    );

    // If the next available time exceeds working hours, no slots available
    if (nextAvailableTime + totalServiceDuration > closingTimeInMinutes) {
      console.warn("No available slots within salon hours");
      return {
        available: false,
        message: "No slots available for the selected time.",
        nextAvailableTime: null,
      };
    }

    // Return the availability status and next possible slot
    return {
      available: isAvailable,
      message: isAvailable ? "Slot available" : "The selected time slot is already booked.",
      nextAvailableTime: moment
        .utc()
        .startOf('day')
        .add(nextAvailableTime, 'minutes')
        .format('hh:mm A'),
    };
  } catch (error) {
    console.error("Error checking slot availability:", error.message);
    throw new Error("Error checking slot availability");
  }
};



// Route to create an appointment
router.post('/', async (req, res) => {
  const { salonId, appointmentDate, time, services, customerId, customerName, customerPhone, stylistId } = req.body;

  try {
    if (!services || services.length === 0) {
      return res.status(400).send({ message: 'No services provided' });
    }

    // Calculate total service duration
    const totalServiceDuration = services.reduce((total, service) => total + service.duration, 0);

    // Parse the selected time and appointment date
    const selectedTime = moment(time, 'hh:mm A');
    const selectedTimeInMinutes = selectedTime.hours() * 60 + selectedTime.minutes();
    const parsedAppointmentDate = moment(appointmentDate, 'YYYY-MM-DD').toDate();

    // Check if the slot is available
    const result = await checkSlotAvailability(salonId, parsedAppointmentDate, selectedTimeInMinutes, totalServiceDuration, stylistId);

    if (result.available) {
      // Get salon details
      const salon = await Salon.findById(salonId);
      
      // Find stylist in salon
      const stylist = salon.stylists.find(stylist => stylist._id.toString() === stylistId.toString());
      
      // Debugging: log stylist data
      console.log('Stylist:', stylist);  // Ensure stylist data is being fetched

      if (!stylist) {
        return res.status(404).send({ message: 'Stylist not found' });
      }

      // Prepare service details
      const serviceDetails = services.map(service => ({
        serviceId: service.serviceId,
        serviceName: service.name,
        serviceDuration: service.duration,
        servicePrice: service.price || 300,  // Default price if not provided
      }));

      // Create appointment with stylist details
      const appointment = new Appointment({
        salonId,
        appointmentDate: parsedAppointmentDate,
        time: selectedTimeInMinutes,
        totalServiceDuration,
        customerId,
        customerName,
        customerPhone,
        serviceDetails,
        stylistId,
        stylistName: stylist.name,  // Add stylist name
        stylistImage: stylist.image,  // Add stylist image
        status: 'Confirmed',  // Default status
      });

      // Save the appointment
      await appointment.save();
      console.log('Appointment created:', appointment);  // Check if stylistName is saved correctly
      return res.status(201).send(appointment);
    } else {
      return res.status(400).send({
        message: result.message,
        nextAvailableTime: result.nextAvailableTime,
      });
    }
  } catch (error) {
    console.error('Error creating appointment:', error.message);
    res.status(500).send({ message: 'Error creating appointment', error: error.message });
  }
});



// Get appointments for a specific salon
router.get('/salon/:salonId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ salonId: req.params.salonId });
    res.status(200).send(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).send({ message: 'Error fetching appointments', error: error.message });
  }
});

// Update appointment status
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).send({ message: 'Appointment not found' });
    }
    res.status(200).send(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error.message);
    res.status(500).send({ message: 'Error updating appointment', error: error.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).send({ message: 'Appointment not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting appointment:', error.message);
    res.status(500).send({ message: 'Error deleting appointment', error: error.message });
  }
});

module.exports = router;
