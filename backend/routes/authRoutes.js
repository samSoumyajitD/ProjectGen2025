const express = require('express');
const { register, login, logout } = require('../controllers/authController');

const router = express.Router();

// Routes
router.post('/register', register); // User registration
router.post('/login', login);       // User login
router.post('/logout', logout);     // User logout

module.exports = router;
