const express = require('express');
const router = express.Router(); // Define the router
const Salon = require('../../models/Salon'); // Import the Salon model (adjust the path as needed)

// Backend Route to fetch stylists with name and image
router.get('/:salonId/stylists', async (req, res) => {
    try {
        const salonId = req.params.salonId;
        const salon = await Salon.findById(salonId);

        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        // Assuming stylists is an array of objects with name and image properties
        const stylists = salon.stylists.map(stylist => ({
            _id: stylist._id,
            name: stylist.name,
            image: stylist.image,  // Assuming you have an image field in your stylist data
        }));

        res.json(stylists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router; // Export the router