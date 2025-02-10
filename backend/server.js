require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware

// Salon APIs routes
const authRoutes = require('./routes/login/authRoutes'); // Updated path for login
const salonRoutes = require('./routes/register/salonRoutes'); // Correct path for salon registration
 // For getting the data from database to salon-admin page header
const salonAdminRoutes = require('./routes/salonAdmin/salonAdminRoutes'); // Adjust based on your structure
// For settings page routes
const salonAdminSettingsRoutes = require('./routes/salonAPIs/salonSettings/salonAdminSettingsRoutes');
// Fetch Appointments for Salons
const fetchAppointmentsRoutes = require('./routes/appointments/fetchAppointmentsRoutes');



// Customers APIs routes
 // For register the customer
const customerRegisterationRoutes = require('./routes/Customer/registeration/customerRegisterationRoutes');
// For login the customer
const customerLoginRoutes = require('./routes/Customer/login/customerLoginRoutes');
// for connecting the customer dashboard with correct customer
const customerDashboardRoutes = require('./routes/Customer/dashboard/customerDashboardRoutes'); // Import the dashboard route



// Appointment APIs routes
const stylistRoutes = require('./routes/appointments/stylistAppointmentRoutes');
const servicesRoutes = require('./routes/appointments/servicesAppointmentRoutes');
const appointmentRoutes = require('./routes/appointments/appointmentRoutes'); // Ensure the path is correct



const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS to allow communication between front-end and back-end
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3002"], })); // Adjust the origin if needed

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

// for settings page of salon admin
// Use the route
app.use("/api/salon", salonAdminSettingsRoutes);


// Customer API Endpoints
 
// Use the customer registration routes
app.use('/api/customers', customerRegisterationRoutes);

// Use the customer registration and login routes
app.use('/api/customers', require('./routes/Customer/login/customerLoginRoutes'));
app.use('/api/customers', customerLoginRoutes);

// use the customer dashboard API connection 
app.use('/api/customers', customerDashboardRoutes); // Register the dashboard route



// Appointment APIs Endpoints
app.use('/api/appointments', stylistRoutes);
app.use('/api/appointments', servicesRoutes); 
// create appointment
app.use('/api/appointments', appointmentRoutes);
// Fetch Appointments 
app.use('/api/appointments', fetchAppointmentsRoutes);





// Error handling middleware for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
