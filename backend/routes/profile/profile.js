const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth'); // Import your authentication middleware
const SalonAdmin = require('../models/SalonAdmin'); // Import your model

// GET /api/salon-admin/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const adminId = req.adminId; // Assume your middleware sets req.adminId based on the token
    const admin = await SalonAdmin.findById(adminId).select('-password'); // Exclude password from response

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin); // Return the admin data
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
