"use client";

import { motion } from "framer-motion";

export default function TextInput({ question, value, onChange }) {
  return (
    <div className="mb-4">
      <motion.label className="block text-lg dark:text-white font-medium mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {question}
      </motion.label>
      <motion.input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full dark:text-white px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      />
    </div>
  );
}
