// near-me/backend/routes/Customer/login/customerLoginRoutes.js

const express = require('express');
const Customer = require('../../../models/customers/CustomerRegisteration');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
    const emailOrPhone = req.body.emailOrPhone?.trim(); // Use optional chaining to avoid errors
    const password = req.body.password?.trim(); // Add the same check for password

    console.log('Received login data:', req.body); // Log the incoming data

    if (!emailOrPhone || !password) {
        return res.status(400).json({ message: 'Email/Phone and password are required.' });
    }

    try {
        // Find customer by email or phone number
        const customer = await Customer.findOne({
            $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }]
        });

        if (!customer) {
            console.log('No customer found. Invalid Email or Phone.');
            return res.status(400).json({ message: 'Invalid Email or Phone.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Generated Token:', token);
        // Successful login - send the token back in the response
        res.status(200).json({ message: 'Login successful!', token }); // Return token here
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
