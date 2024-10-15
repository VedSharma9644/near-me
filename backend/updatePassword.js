const Salon = require('../models/Salon'); // Adjust the path if necessary

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the salon user in the database
        const salon = await Salon.findOne({ email });
        if (!salon) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, salon.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Successful login logic
        res.status(200).json({ message: 'Login successful', salon });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
