"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
      <motion.div
        className="bg-blue-600 h-2.5 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
