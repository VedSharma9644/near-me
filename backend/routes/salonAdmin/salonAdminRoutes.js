const express = require('express');
const authMiddleware = require('../../middleware/auth'); // Adjust the path as necessary
const Salon = require('../../models/Salon'); // Adjust the model import as needed

const router = express.Router();

// Protected route to get the dashboard data
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        // Assuming req.user contains the decoded token info
        const user = await Salon.findById(req.user.id); // Fetch user data based on the token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user); // Send user data as a response
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
