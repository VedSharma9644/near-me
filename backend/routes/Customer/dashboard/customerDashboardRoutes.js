const express = require('express');
const router = express.Router();
const Customer = require('../../../models/customers/CustomerRegisteration');
const { customerAuthMiddleware } = require('../../../middleware/customerMiddleware'); // Ensure proper import

// Protected route to get customer dashboard data
router.get('/dashboard', customerAuthMiddleware, async (req, res) => {
    try {
        const customer = req.customer; // Directly access customer from the middleware
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        res.json({
            _id: customer._id, // Include customer ID
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            // Include other fields if necessary
        });
    } catch (error) {
        console.error('Error fetching customer data:', error);
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
