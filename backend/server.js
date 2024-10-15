require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/login/authRoutes'); // Updated path for login
const salonRoutes = require('./routes/register/salonRoutes'); // Correct path for salon registration

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS to allow communication between front-end and back-end
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust the origin if needed

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if the connection fails
    });

// Use login routes for authentication
app.use('/api/login', authRoutes); // Endpoint for login

// Use registration routes for salon registration
app.use('/api/salons', salonRoutes); // Endpoint for salon registration

// Error handling middleware for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
