const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Helper: Generate JWT
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{3,}$/;
        if (!usernameRegex.test(name)) {
            return res.status(400).json({
                message: 'Username must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 3 characters long.',
            });
        }

        const existingUsername = await User.findOne({ name });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists. Please choose a different one.' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine default status based on role
        const status = role === 'Student' || role === 'Admin' || role ==='Working_Pro'? 'Active' : 'Pending';

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Student',
            status,
        });

        res.status(201).json({
            message: `User registered successfully with status: ${user.status}.`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        console.error('Register Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};



// Login user with role validation
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status !== 'Active') {
            return res.status(403).json({ message: `Account is ${user.status}. Access denied.` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: 'Role mismatch: Access denied' });
        }

        const token = generateToken(user._id, user.role);
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, role: user.role },
            token,
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// Logout user
exports.logout = (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'strict' }); // Clear the cookie
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout Error:', error.message);
        res.status(500).json({ message: 'An error occurred during logout' });
    }
};
