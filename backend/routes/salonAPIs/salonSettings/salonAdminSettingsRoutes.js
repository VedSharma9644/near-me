const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/auth'); // Adjust the path if necessary
const salonAdminController = require('../../../controllers/salonSettingsController'); // Ensure this path is correct

// Apply the authentication middleware to the routes
router.get('/settings', authMiddleware, salonAdminController.getSalonSettings);
router.put('/settings', authMiddleware, salonAdminController.updateSalonSettings);

module.exports = router;
