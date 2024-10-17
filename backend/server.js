require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/login/authRoutes'); // Updated path for login
const salonRoutes = require('./routes/register/salonRoutes'); // Correct path for salon registration
 // For getting the data from database to salon-admin page header
const salonAdminRoutes = require('./routes/salonAdmin/salonAdminRoutes'); // Adjust based on your structure
 // For register the customer
const customerRegisterationRoutes = require('./routes/Customer/registeration/customerRegisterationRoutes');
// For login the customer
const customerLoginRoutes = require('./routes/Customer/login/customerLoginRoutes');
// for connecting the customer dashboard with correct customer
const customerDashboardRoutes = require('./routes/Customer/dashboard/customerDashboardRoutes'); // Import the dashboard route



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

    // Salon admin API Endpoints
// Use login routes for authentication
app.use('/api/login', authRoutes); // Endpoint for login

// Use registration routes for salon registration
app.use('/api/salons', salonRoutes); // Endpoint for salon registration

// Get data from database to profile page
app.use('/api/salonAdmin', salonAdminRoutes); // Ensure the correct path


// Customer API Endpoints
 
// Use the customer registration routes
app.use('/api/customers', customerRegisterationRoutes);

// Use the customer registration and login routes
app.use('/api/customers', require('./routes/Customer/login/customerLoginRoutes'));
app.use('/api/customers', customerLoginRoutes);

// use the customer dashboard API connection 
app.use('/api/customers', customerDashboardRoutes); // Register the dashboard route



// Error handling middleware for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
