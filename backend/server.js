require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const salonRoutes = require('./routes/salonRoutes'); // Adjust the path if necessary

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS to allow communication between front-end and back-end
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust the origin if needed

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Use salon routes
app.use('/api/salons', salonRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
