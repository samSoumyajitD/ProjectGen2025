const User = require('../models/User');
const mongoose = require('mongoose');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Validate role
        if (!['Reporter', 'Reader', 'Editor'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete user


exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.role === 'Admin') {
        return res.status(403).json({ message: 'Cannot delete Admin users' });
      }
  
      // Use deleteOne instead of remove
      await User.deleteOne({ _id: id });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // Update user status
exports.updateUserStatus = async (req, res) => {
  try {
      const { status } = req.body;

      // Validate status
      if (!['Active', 'Pending', 'Blocked','Inactive'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status specified' });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.status = status;
      await user.save();

      res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
