const Goal = require('../models/Goal');

// Controller to create or update a goal
exports.createOrUpdateGoal = async (req, res) => {
    try {
        const { goal, time_per_week, learning_mode, skill_level, deadline } = req.body;
        const userId = req.user.id; // Get user ID from JWT

        // Check if a goal already exists for this user
        let existingGoal = await Goal.findOne({ userId });

        if (existingGoal) {
            // If a goal exists, update it
            existingGoal.goal = goal;
            existingGoal.time_per_week = time_per_week;
            existingGoal.learning_mode = learning_mode;
            existingGoal.skill_level = skill_level;
            existingGoal.deadline = deadline;

            // Save the updated goal
            await existingGoal.save();

            res.status(200).json({ message: 'Goal updated successfully', goal: existingGoal });
        } else {
            // If no goal exists, create a new one
            const newGoal = await Goal.create({
                goal,
                time_per_week,
                learning_mode,
                skill_level,
                deadline,
                userId,
            });

            res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); // Send back the error message
    }
};
