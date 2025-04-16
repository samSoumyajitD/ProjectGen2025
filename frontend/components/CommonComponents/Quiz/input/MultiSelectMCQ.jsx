"use client";

import { motion } from "framer-motion";

export default function MultiSelectMCQ({ question, options, value, onChange }) {
  const handleChange = (option) => {
    const newValue = value.includes(option) ? value.filter((v) => v !== option) : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-medium mb-2 dark:text-white">
        {question}
      </motion.p>
      {options.map((option) => (
        <motion.label key={option} className="block dark:text-white mb-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <input type="checkbox" value={option} checked={value.includes(option)} onChange={() => handleChange(option)} className="mr-2 dark:text-white" />
          {option}
        </motion.label>
      ))}
    </div>
  );
}
