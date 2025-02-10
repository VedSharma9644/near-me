// In appointmentController.js
const Appointment = require('../../models/appointment');

const getSalonAppointments = async (req, res) => {
    const { salonId } = req.params;

    try {
        const appointments = await Appointment.find({ salonId })
            .populate('customerId', 'name phone') // Populate customer details
            .populate('stylistId', 'name')       // Populate stylist details
            .populate('serviceId', 'name price') // Populate service details
            .sort({ appointmentDate: 1, time: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

module.exports = { getSalonAppointments };
