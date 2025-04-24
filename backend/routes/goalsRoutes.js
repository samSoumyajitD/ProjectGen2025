const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createOrUpdateGoal, getGoalsByUserId } = require('../controllers/goalController');
router.post('/createOrUpdate', protect, authorize('Student','Admin','Working_Pro'), createOrUpdateGoal);
router.get('/getGoalsByUserId', protect, authorize('Student','Admin','Working_Pro'),getGoalsByUserId);
module.exports = router;