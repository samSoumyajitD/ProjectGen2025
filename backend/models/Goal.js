const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  // Reference to the User model (Assuming 'User' is the collection storing user details)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  time_per_week: {
    type: String,
    required: true,
  },
  learning_mode: {
    type: String,
     // Modify based on your use case
    required: true,
  },
  skill_level: {
    type: String,

    required: true,
  },
  deadline: {
    type: String,
    required: true,
  }
}, { 
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
