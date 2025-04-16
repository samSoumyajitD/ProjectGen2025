const User = require('../models/User');

// Get user profile by ID
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');; // Assuming `req.user.id` is set by authentication middleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the profile.' });
    }
};
exports.updateProfile = async (req, res) => {
    try {
       
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, // Pass the entire request body as the update data
            { new: true } // To return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the profile.' });
    }
};

