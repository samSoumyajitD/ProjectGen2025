import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Trophy, Sun, Moon } from "lucide-react";
import Weekday from "./ClockCompo/Weekday";
import Weekend from "./ClockCompo/Weekend";

interface Schedule {
  weekday: {
    work: number;
    development: number;
    personal: number;
  };
  weekend: {
    development: number;
    personal: number;
  };
}

const FourthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"weekday" | "weekend">("weekday");
  const [schedule, setSchedule] = useState<Schedule>({
    weekday: { work: 0, development: 0, personal: 0 },
    weekend: { development: 0, personal: 0 },
  });
  const [showSummary, setShowSummary] = useState(false);

  const handleInputChange = (type: keyof Schedule, field: string, value: number) => {
    setSchedule((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const saveSchedule = () => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
    setShowSummary(true);
  };

  const progress = () => {
    const totalHours = 24 * 7;
    const scheduledHours =
      schedule.weekday.work * 5 +
      schedule.weekday.development * 5 +
      schedule.weekday.personal * 5 +
      schedule.weekend.development * 2 +
      schedule.weekend.personal * 2;
    return (scheduledHours / totalHours) * 100;
  };

  const calculateSummary = () => {
    const totalWork = schedule.weekday.work * 5;
    const totalDevelopment = schedule.weekday.development * 5 + schedule.weekend.development * 2;
    const totalPersonal = schedule.weekday.personal * 5 + schedule.weekend.personal * 2;

    return {
      totalWork,
      totalDevelopment,
      totalPersonal,
    };
  };

  const summary = calculateSummary();

  const isScheduleComplete = () => {
    const { weekday, weekend } = schedule;
    return (
      weekday.work + weekday.development + weekday.personal <= 24 &&
      weekend.development + weekend.personal <= 24 &&
      (weekday.work > 0 || weekday.development > 0 || weekday.personal > 0) &&
      (weekend.development > 0 || weekend.personal > 0)
    );
  };

  return (
    <div className="min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="space-y-4 px-6">
          <h2 className="text-4xl font-bold text-[#1d1d1f]">Time Planner</h2>
          <p className="text-lg text-[#6e6e73]">
            Balance your schedule with elegance
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Tab Navigation */}
              <div className="flex justify-center space-x-6 bg-gray-100 gap-10 p-2 mx-12 rounded-full shadow-sm">
                <button
                  onClick={() => setActiveTab("weekday")}
                  className={`flex items-center justify-center px-6 py-2 rounded-full transition-all duration-300 ease-in-out ${
                    activeTab === "weekday"
                      ? "bg-white shadow-md text-blue-600"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Sun className="inline-block w-5 h-5 mr-2" />
                  Weekdays
                </button>
                <button
                  onClick={() => setActiveTab("weekend")}
                  className={`flex items-center justify-center px-6 py-2 rounded-full transition-all duration-300 ease-in-out ${
                    activeTab === "weekend"
                      ? "bg-white shadow-md text-blue-600"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Moon className="inline-block w-5 h-5 mr-2" />
                  Weekends
                </button>
              </div>

              {/* Schedule Inputs */}
              <motion.div className="bg-white rounded-2xl py-6 px-2" layout>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {activeTab === "weekday" ? (
                      <Weekday schedule={schedule.weekday} handleInputChange={handleInputChange} />
                    ) : (
                      <Weekend schedule={schedule.weekend} handleInputChange={handleInputChange} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Progress Indicator */}
              <div className="flex justify-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mx-12">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress()}%` }}
                  ></div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={saveSchedule}
                  className="bg-[#007AFF] text-white py-2 px-8 rounded-full shadow-md hover:bg-[#0063CC] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Save Schedule"
                  disabled={!isScheduleComplete()}
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle className="mx-auto h-16 w-16 text-[#32d74b]" />
                </motion.div>
                <h3 className="mt-4 text-3xl font-bold text-[#1d1d1f]">Perfect!</h3>
                <p className="mt-2 text-lg text-[#6e6e73]">Here's your weekly schedule</p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  { label: "Work Hours", value: summary.totalWork, icon: "⚡️" },
                  { label: "Skill Development", value: summary.totalDevelopment, icon: "💡" },
                  { label: "Personal Time", value: summary.totalPersonal, icon: "🌟" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-gray-100 rounded-xl p-4 flex items-center justify-between"
                  >
                    <span className="text-lg font-medium text-[#1d1d1f]">
                      {item.icon} {item.label}
                    </span>
                    <span className="text-lg font-bold text-[#1d1d1f]">{item.value}h</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8 flex justify-center items-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Trophy className="h-8 w-8 text-[#ffd60a]" />
                <span className="ml-2 text-[#6e6e73]">Schedule Master!</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FourthPage;