const express = require('express');
const Salon = require('../../models/Salon'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const router = express.Router();

// Use the secret key from environment variables
const secret = process.env.JWT_SECRET; // Ensure you are using the correct variable name

// POST login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Trim email and password
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Log trimmed email and password
        console.log('Trimmed Email:', trimmedEmail);
        console.log('Trimmed Password:', trimmedPassword); // Log the trimmed password

        // Find salon by email
        const salon = await Salon.findOne({ email: trimmedEmail });

        // Log incoming data and found salon
        console.log('Incoming Email:', trimmedEmail);
        console.log('Found Salon:', salon);

        // Check if salon exists
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(trimmedPassword, salon.password);

        // Log the comparison result
        console.log('Password Match:', isMatch);

        // Check if password matches
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: salon._id }, secret, { expiresIn: '1h' });

        // Send response with token and salon info
        res.status(200).json({
            message: 'Login successful',
            token,
            salon: {
                id: salon._id,
                name: salon.name,
                email: salon.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error); // Log error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
