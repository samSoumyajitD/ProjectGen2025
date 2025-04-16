"use client";

import { motion } from "framer-motion";

export default function MCQInput({ question, options, value, onChange }) {
  return (
    <div className="mb-4">
      {/* Add dark:text-white to the question text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-medium mb-2 dark:text-white"
      >
        {question}
      </motion.p>
      {options.map((option) => (
        <motion.label
          key={option}
          className="block mb-2 dark:text-white" // Add dark:text-white here
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="mr-2 dark:text-white" // Add dark:text-white here
          />
          {option}
        </motion.label>
      ))}
    </div>
  );
}