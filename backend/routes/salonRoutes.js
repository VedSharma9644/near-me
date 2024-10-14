const express = require('express');
const Salon = require('../models/Salon');

const router = express.Router();

// GET all salons
router.get('/', async (req, res) => {
    try {
        const salons = await Salon.find();
        res.status(200).json(salons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new salon
router.post('/', async (req, res) => {
    const salon = new Salon({
        name: req.body.salonName,          // Change name to salonName
        ownerName: req.body.ownerName,     // Add ownerName field to the model
        numberOfStylists: req.body.numberOfStylists, // Add numberOfStylists
        openingTime: req.body.openingTime,  // Add openingTime
        closingTime: req.body.closingTime,  // Add closingTime
        services: req.body.services,        // Add services array
        username: req.body.username,
        password: req.body.password,
    });

    try {
        const savedSalon = await salon.save();
        res.status(201).json(savedSalon);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET a single salon by ID
router.get('/:id', async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }
        res.status(200).json(salon);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
