const Goal = require('../models/Goal');

// Create or update goal
exports.createGoal = async (req, res) => {
    try {
        const { goal, time_per_week, learning_mode, skill_level, deadline } = req.body;
        const userId = req.user.id;

        const newGoal = await Goal.create({
            goal,
            time_per_week,
            learning_mode,
            skill_level,
            deadline,
            userId,
        });

        res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get goals by user ID
exports.getGoalsByUserId = async (req, res) => {
    try {
        const userCookie = req.cookies.user;

        if (!userCookie) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
        const userId = user.id;

        const goals = await Goal.find({ userId });

        res.status(200).json({ goals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


