const moment = require('moment'); // Ensure moment is required
const Appointment = require('../models/appointments/appointment');
const Salon = require('../models/Salon');

const checkSlotAvailability = async (salonId, appointmentDate, selectedTimeInMinutes, serviceDuration) => {
  const salon = await Salon.findById(salonId);
  const workingHours = salon.workingHours;  // Assuming this field exists

  // Ensure the appointment is within salon hours
  const openingTimeInMinutes = moment(salon.openingTime, 'HH:mm').minutes();
  const closingTimeInMinutes = moment(salon.closingTime, 'HH:mm').minutes();
  
  if (selectedTimeInMinutes < openingTimeInMinutes || selectedTimeInMinutes + serviceDuration > closingTimeInMinutes) {
    return { available: false, message: 'The selected time is outside the salon\'s working hours.' };
  }

  // Check availability for the selected time and suggest alternatives
  const appointments = await Appointment.find({
    salonId,
    appointmentDate,
    time: selectedTimeInMinutes,
  });

  if (appointments.length === 0) {
    // Return a valid moment object for the slot
    return { available: true, slot: moment(appointmentDate).set('minutes', selectedTimeInMinutes) };
  }

  // Suggest an alternative (for simplicity, we'll just add 15 minutes)
  const alternativeTime = moment().set('minutes', selectedTimeInMinutes + 15); // Add 15 minutes for the next slot
  return { available: false, slot: alternativeTime };
};

module.exports = { checkSlotAvailability };

