const Salon = require('../models/Salon'); // Import the SalonAdmin model

// Get salon settings
// Get salon settings
exports.getSalonSettings = async (req, res) => {
  try {
    // Ensure the user is authenticated and req.user is set
    if (!req.user) {
      console.log('User not authenticated, req.user is undefined');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('Authenticated user:', req.user); // Log authenticated user info
    console.log('User ID from token:', req.user.id); // Log the user ID

    // Find the salon admin by ID and return the entire document for debugging
    const salonSettings = await Salon.findById(req.user.id);
    console.log('Fetched salon settings:', salonSettings); // Log the entire document

    if (!salonSettings) {
      return res.status(404).json({ error: 'Salon settings not found' });
    }

    // Respond with the salon settings
    return res.status(200).json(salonSettings);
  } catch (error) {
    console.error('Error fetching salon settings:', error);
    return res.status(500).json({ error: 'Server error while fetching salon settings' });
  }
};




// Controller for updating salon settings
exports.updateSalonSettings = async (req, res) => {
  try {
    const { openingTime, closingTime, stylists, services } = req.body; // Get the fields from the request body

    // Change the model from SalonAdmin to Salon
    const salonSettings = await Salon.findByIdAndUpdate(
      req.user.id, // Use req.user.id which is the authenticated user's ID
      { openingTime, closingTime, stylists, services }, // Update these fields
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!salonSettings) {
      return res.status(404).json({ error: 'Salon admin not found' });
    }

    res.status(200).json(salonSettings); // Respond with the updated data
  } catch (error) {
    console.error('Error updating salon settings:', error);
    res.status(500).json({ error: 'Server error while updating salon settings' });
  }
};



