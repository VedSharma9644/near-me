const express = require('express');
const router = express.Router();
const Salon = require('../../models/Salon'); // Import your Salon model

// Get services for a specific salon by salonId
router.get('/:salonId/services', async (req, res) => {
    try {
        const salonId = req.params.salonId; // Get salonId from URL
        const salon = await Salon.findById(salonId); // Use salonId to query the database

        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        // Respond with services if they exist in the salon model
        res.json(salon.services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
