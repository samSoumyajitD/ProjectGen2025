import React from "react";
import { motion } from "framer-motion";
import {
    PersonBoard32Regular,
    TextBulletListSquare32Regular,
} from "@fluentui/react-icons";

interface SecondPageProps {
    takeNotes: string;
    setTakeNotes: (value: string) => void;
    learningType: string;
    setLearningType: (value: string) => void;
    expertiseLevel: string;
    setExpertiseLevel: (value: string) => void;
    prefersGroupLearning: string;
    setPrefersGroupLearning: (value: string) => void;
}

export const FirstSubPageTwo: React.FC<SecondPageProps> = ({
    takeNotes,
    setTakeNotes,
    learningType,
    setLearningType,
    expertiseLevel,
    setExpertiseLevel,
    prefersGroupLearning,
    setPrefersGroupLearning,
}) => {
    return (
        <div className="max-w-3xl mx-auto space-y-10 p-6 bg-white/80 backdrop-blur-lg   w-full md:p-8 sm:p-6">
            {/* Header */}
            <div className="text-center space-y-3">

                <p className="text-gray-500 text-lg sm:text-base">Show us your vibe—how u learn best.</p>
            </div>

            {/* Learning Preferences Form */}
            <div className="space-y-8">
                {/* Note Taking Preference */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 sm:text-base">Do you take notes while learning?</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {["Yes", "No"].map((option) => (
                            <motion.button
                                key={option}
                                onClick={() => setTakeNotes(option)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 text-center min-w-[120px]
                                    ${takeNotes === option ? "bg-gray-900 text-white shadow-lg" : "bg-white border border-gray-300 hover:bg-gray-100 shadow-sm"}
                                `}
                            >
                                {option}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Learning Type */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 sm:text-base">How do you prefer to learn?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
                        {[
                            { value: "self paced", label: "Self-Paced", Icon: PersonBoard32Regular },
                            { value: "structured", label: "Structured", Icon: TextBulletListSquare32Regular },
                        ].map(({ value, label, Icon }) => (
                            <motion.button
                                key={value}
                                onClick={() => setLearningType(value)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-6 rounded-2xl text-left transition-all duration-200 flex items-center gap-4 w-full
                                    ${learningType === value ? "bg-gray-900 text-white shadow-xl" : "bg-white border border-gray-300 hover:bg-gray-100 shadow-md"}
                                `}
                            >
                                <Icon className="w-10 h-10 text-gray-700" />
                                <div>
                                    <span className="text-lg font-medium sm:text-base">{label}</span>
                                    <p className={`mt-1 text-sm ${learningType === value ? "text-gray-300" : "text-gray-500"}`}>
                                        {value === "self paced" ? "Learn at your own pace" : "Follow a structured schedule"}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Expertise Level */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 sm:text-base">What's your expertise level?</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {["Beginner", "Intermediate", "Expert"].map((level) => (
                            <motion.button
                                key={level}
                                onClick={() => setExpertiseLevel(level)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`py-2 px-6 rounded-full font-medium transition-all duration-200 min-w-[100px]
                                    ${expertiseLevel === level ? "bg-gray-900 text-white shadow-lg" : "bg-white border border-gray-300 hover:bg-gray-100 shadow-sm"}
                                `}
                            >
                                {level}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Group Learning Preference */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 sm:text-base">Do you prefer learning in groups?</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {["Yes", "No"].map((option) => (
                            <motion.button
                                key={option}
                                onClick={() => setPrefersGroupLearning(option)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-200 text-center min-w-[120px]
                                    ${prefersGroupLearning === option ? "bg-gray-900 text-white shadow-lg" : "bg-white border border-gray-300 hover:bg-gray-100 shadow-sm"}
                                `}
                            >
                                {option}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div className="text-center">
                <p className="text-sm text-gray-500">Your preferences help us tailor your learning journey.</p>
            </div>
        </div>
    );
};
