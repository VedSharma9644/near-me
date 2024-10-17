// backend/middleware/customerMiddleware.js
const jwt = require('jsonwebtoken');
const Customer = require('../models/customers/CustomerRegisteration');

// Validation Middleware for registration
const customerValidation = (req, res, next) => {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Add more validation logic if needed (e.g., regex for email, phone number format, etc.)

    next();
};

// JWT Authentication Middleware for protected routes
const customerAuthMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        console.log('Decoded Token:', decoded);
        const customer = await Customer.findById(decoded.id); // Get customer by decoded ID

        if (!customer) {
            return res.status(401).json({ message: 'Customer not found.' });
        }

        req.customer = customer; // Attach customer data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token is not valid:', err);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = {
    customerValidation,
    customerAuthMiddleware,
};
