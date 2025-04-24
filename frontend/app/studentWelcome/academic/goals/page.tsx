"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StuNavBar from "../../../../components/CommonComponents/WelcomePageNav";
import Link from "next/link";
import Cookies from "js-cookie";

interface Goal {
  _id: string;
  goal: string;
  deadline: string;
  progress?: number;
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Extract user ID from cookies
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        setUserId(user.id);
      } catch (err) {
        console.error("Failed to parse user cookie:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchGoals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/goals/getGoalsByUserId",
          {
            withCredentials: true,
          }
        );
        const goalsWithProgress = response.data.goals.map((goal: Goal) => ({
          ...goal,
          progress: 0, // Dummy progress
        }));
        setGoals(goalsWithProgress);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch goals");
      }
    };

    fetchGoals();
  }, [userId]);

  const handleContinueLearning = (goal: string) => {
    console.log(`Continuing learning for: ${goal}`);
  };

  const handleDeleteGoal = async (goalId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/remove-roadmap/${userId}/${goalId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete goal");
    }
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
            <div key={goal._id} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{goal.goal}</h2>
              <p className="text-gray-600 dark:text-gray-400">Deadline: {goal.deadline} months</p>

              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 mt-3">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Progress: {goal.progress}%
              </p>

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

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteGoal(goal._id)}
                className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm transition"
              >
                Delete
              </button>
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
