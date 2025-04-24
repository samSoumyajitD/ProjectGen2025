"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StuNavBar from "../../../../components/CommonComponents/WelcomePageNav";
import Link from "next/link";

interface Goal {
  _id: string;
  goal: string;
  deadline: string;
  progress?: number;
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/goals/getGoalsByUserId",
          {
            withCredentials: true, // Ensures cookies are sent with the request
          }
        );
        const goalsWithProgress = response.data.goals.map((goal: Goal) => ({
          ...goal,
          progress: 0, // Dummy progress; replace with actual progress logic
        }));
        setGoals(goalsWithProgress);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch goals");
      }
    };
    fetchGoals();
  }, []);

  const handleContinueLearning = (goal: string) => {
    console.log(`Continuing learning for: ${goal}`);
    // Add any side effects or logging here if needed
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black min-h-screen">
      <StuNavBar />
      <div className="text-center mb-8">
        <h1 className="text-4xl pt-6 font-extrabold text-gray-800 dark:text-gray-200">
          Academic Goals
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Track your academic progress effectively
        </p>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {goals.length > 0 ? (
        <div className="max-w-4xl mx-auto px-4">
          {goals.map((goal) => (
            <div key={goal._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{goal.goal}</h2>
              <p className="text-gray-600 dark:text-gray-400">Deadline: {goal.deadline} months</p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 mt-3">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Progress: {goal.progress}%
              </p>

              {/* Continue Learning Button with dynamic route */}
              <Link href={`/studentWelcome/academic/goals/${goal._id}`}>
                <motion.button
                  onClick={() => handleContinueLearning(goal.goal)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Continue Learning
                </motion.button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No goals found.
        </p>
      )}
    </div>
  );
};

export default GoalsPage;
