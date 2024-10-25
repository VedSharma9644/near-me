const express = require('express');
const router = express.Router();
const Salon = require('../../models/Salon'); // Import your Salon model

// Get stylists for a specific salon
router.get('/:salonId/stylists', async (req, res) => {
    try {
        const salonId = req.params.salonId;
        const salon = await Salon.findById(salonId);

        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        res.json(salon.stylists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


module.exports = router;
