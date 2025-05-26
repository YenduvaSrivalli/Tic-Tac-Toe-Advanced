const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./models/User");  // Assuming you have a User model

// Login route
const login = async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,  // Use the secret key from your .env file
        { expiresIn: '1h' }
    );

    res.json({ token });
};

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();  // Ensuring next() is called properly
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { login, isAuthenticated };
