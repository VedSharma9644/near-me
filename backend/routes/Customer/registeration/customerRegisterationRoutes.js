// backend/routes/Customer/registeration/customerRegisterationRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {customerValidation} = require('../../../middleware/customerMiddleware'); // Customer validation middleware
const Customer = require('../../../models/customers/CustomerRegisteration'); // Import the Customer model

// Public route for customer registration
router.post('/register', customerValidation, async (req, res) => {
    console.log(req.body); // Log the request body to check its content
    const { name, email, phoneNumber, password } = req.body;

    try {
        // Check if a customer with the same email or phone number already exists
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email or phone number already exists.' });
        }

        // Hash the password using bcrypt before saving
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds (you can adjust this number)
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new customer with the hashed password
        const newCustomer = new Customer({ name, email, phoneNumber, password: hashedPassword });
        await newCustomer.save();

        res.status(201).json({ message: 'Customer registered successfully!' });
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

