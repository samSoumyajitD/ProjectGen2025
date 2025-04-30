const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createGoal, getGoalsByUserId } = require('../controllers/goalController');
router.post('/createGoale', protect, authorize('Student','Admin','Working_Pro'), createGoal);
router.get('/getGoalsByUserId', protect, authorize('Student','Admin','Working_Pro'),getGoalsByUserId);
module.exports = router;