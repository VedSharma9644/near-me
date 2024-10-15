const express = require('express');
const { body, validationResult } = require('express-validator'); // Import express-validator
const Salon = require('../../models/Salon');
const bcrypt = require('bcrypt'); // Import bcrypt

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

// POST a new salon (Registration)
router.post('/', 
  [
    body('salonName').notEmpty().withMessage('Salon name is required'),
    body('ownerName').notEmpty().withMessage('Owner name is required'),
    body('ownerMobile').isMobilePhone().withMessage('Valid mobile number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { salonName, ownerName, ownerMobile, state, city, area, pincode, email, password } = req.body;

    // Check for existing salon with same email
    const existingSalon = await Salon.findOne({ email });
    if (existingSalon) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const salon = new Salon({
      name: salonName,
      ownerName,
      ownerMobile,
      state,
      city,
      area,
      pincode,
      email,
      password: hashedPassword, // Store the hashed password
      numberOfStylists: req.body.numberOfStylists || 0,
      openingTime: req.body.openingTime || "",
      closingTime: req.body.closingTime || "",
      services: req.body.services || [],
    });

    try {
      const savedSalon = await salon.save();
      res.status(201).json({ message: "Salon registered successfully", salon: savedSalon });
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
