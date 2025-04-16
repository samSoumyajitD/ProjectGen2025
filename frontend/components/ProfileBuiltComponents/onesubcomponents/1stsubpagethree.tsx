import React from "react";
import { CheckmarkCircle24Filled, CompassNorthwest24Filled, Lightbulb24Filled, BrainCircuit24Filled, EyeTracking24Filled } from "@fluentui/react-icons";
import { motion } from "framer-motion";
interface ThirdPageProps {
  avatar: string;
  setAvatar: (value: string) => void;
  preferredLearningTime: string;
  setPreferredLearningTime: (value: string) => void;
}

const avatars = [
  { name: "Explorer", Icon: CompassNorthwest24Filled, description: "Curious and adventurous" },
  { name: "Innovator", Icon: Lightbulb24Filled, description: "Creative and forward-thinking" },
  { name: "Strategist", Icon: BrainCircuit24Filled, description: "Analytical and precise" },
  { name: "Visionary", Icon: EyeTracking24Filled, description: "Big-picture thinker" },
];

const learningTimes = ["Morning", "Afternoon", "Evening", "Night"];

export const FirstSubPageThree: React.FC<ThirdPageProps> = ({
  avatar,
  setAvatar,
  preferredLearningTime,
  setPreferredLearningTime,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-12 p-6">
      {/* Description Section */}
      <div className="text-center space-y-2">
      
        <p className="text-gray-500 text-lg sm:text-base">Pick your vibe.</p>
      </div>

      {/* Avatar Selection */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Choose Your Avatar</h3>
        <div className="grid grid-cols-2 gap-6">
          {avatars.map((av) => (
            <motion.button
              key={av.name}
              onClick={() => setAvatar(av.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-200 shadow-sm 
                ${avatar === av.name ? "bg-gray-900 text-white" : "bg-white border-gray-300 hover:bg-gray-100"}`}
            >
              <av.Icon className="w-16 h-16 mb-3 text-gray-700 group-hover:text-gray-900" />
              <span className="text-sm font-medium">{av.name}</span>
              <p className="text-xs text-gray-500 group-hover:text-gray-700">{av.description}</p>
              {avatar === av.name && <CheckmarkCircle24Filled className="absolute top-2 right-2 w-5 h-5 text-white" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Learning Time Selection */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">When Do You Learn Best?</h3>
        <div className="grid grid-cols-2 gap-4">
          {learningTimes.map((time) => (
            <motion.button
              key={time}
              onClick={() => setPreferredLearningTime(time)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-3 px-6 w-full rounded-full text-sm font-medium transition-all duration-200 shadow-sm 
                ${preferredLearningTime === time ? "bg-gray-900 text-white" : "bg-white border border-gray-300 hover:bg-gray-100"}`}
            >
              {time}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          You can always change these preferences later in your profile settings.
        </p>
      </div>
    </div>
  );
};
