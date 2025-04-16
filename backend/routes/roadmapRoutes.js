const express = require('express');
const router = express.Router();
const { getRoadmaps } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

// Define route to fetch roadmaps
router.get('/roadmaps', protect, getRoadmaps);

module.exports = router;
