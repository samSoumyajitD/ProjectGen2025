const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { getUsers, updateUserRole, deleteUser, updateUserStatus } = require('../controllers/userController');
const { getProfile, updateProfile} = require('../controllers/profileController');

const router = express.Router();

// Admin-only routes
router.get('/', protect, authorize('Admin'), getUsers);
router.put('/:id', protect, authorize('Admin'), updateUserRole);
router.delete('/:id', protect, authorize('Admin'), deleteUser);
router.put('/user/:id/status', protect, authorize('Admin'), updateUserStatus);
// Route to get user profile
router.get('/profile', protect, authorize('Student', 'Working_Pro', 'Admin'),getProfile);

router.put('/profile/:id',protect,authorize('Student','Admin','Working_Pro'),updateProfile)

module.exports = router;
