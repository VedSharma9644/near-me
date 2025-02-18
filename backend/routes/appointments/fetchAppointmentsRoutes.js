const express = require("express");
const router = express.Router();
const Appointment = require("../../models/appointments/appointment");
const Salon = require("../../models/Salon");

router.get("/salon/:salonId", async (req, res) => {
  try {
    const { salonId } = req.params;

    // Fetch the salon details along with its stylists
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    // Fetch all appointments for the salon
    const appointments = await Appointment.find({ salonId })
      .populate("customerId", "name phone")
      .sort({ appointmentDate: 1, time: 1 });

    // Enrich appointments with stylist details
    const enrichedAppointments = appointments.map((appointment) => {
      // Find stylist details from the salon's stylists array
      const stylist = salon.stylists.find(
        (stylist) => stylist._id.toString() === appointment.stylistId.toString()
      );

      return {
        ...appointment.toObject(),
        stylistName: stylist ? stylist.name : "Unknown",
        stylistImage: stylist ? stylist.image : "",
      };
    });

    res.status(200).json(enrichedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
});

module.exports = router;
