"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DynamicInput({ question, value, onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (item) => {
    onChange(value.filter((v) => v !== item));
  };

  return (
    <div className="mb-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-medium mb-4 text-gray-700"
      >
        {question}
      </motion.p>
      <div className="flex mb-4">
        <motion.input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          placeholder="Enter a value"
        />
        <motion.button
          onClick={handleAdd}
          className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          whileTap={{ scale: 0.95 }}
        >
          Add
        </motion.button>
      </div>
      <AnimatePresence>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <motion.span
                key={index}
                className="bg-gray-100 dark:text-white  px-3 py-1.5 rounded-full flex items-center text-sm text-gray-700 hover:bg-gray-200 transition-all duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {item}
                <button
                  onClick={() => handleRemove(item)}
                  className="ml-2 text-red-500 dark:text-white hover:text-red-600 font-bold transition-all duration-200"
                >
                  ✖
                </button>
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}