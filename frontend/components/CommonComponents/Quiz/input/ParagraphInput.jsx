"use client";

import { motion } from "framer-motion";

export default function ParagraphInput({ question, value, onChange }) {
  return (
    <div className="mb-6">
      <motion.label
        className="block text-lg font-medium mb-2 text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {question}
      </motion.label>
      <motion.textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 dark:text-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        rows={5}
        placeholder="Type your answer here..."
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileFocus={{ scale: 1.02, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
      />
    </div>
  );
}