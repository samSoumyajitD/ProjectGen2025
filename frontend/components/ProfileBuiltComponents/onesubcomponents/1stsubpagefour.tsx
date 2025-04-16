import React, { useState } from "react";
import { motion } from "framer-motion";

interface FourthPageProps {
  areasOfInterest: string[];
  setAreasOfInterest: (values: string[]) => void;
  preferredResources: string[];
  setPreferredResources: (values: string[]) => void;
}

export const FirstSubPageFour: React.FC<FourthPageProps> = ({
  areasOfInterest,
  setAreasOfInterest,
  preferredResources,
  setPreferredResources,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddInterest = () => {
    if (inputValue.trim() && !areasOfInterest.includes(inputValue.trim())) {
      setAreasOfInterest([...areasOfInterest, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setAreasOfInterest(areasOfInterest.filter((item) => item !== interest));
  };

  const handleResourceChange = (resource: string) => {
    if (preferredResources.includes(resource)) {
      setPreferredResources(preferredResources.filter((item) => item !== resource));
    } else {
      setPreferredResources([...preferredResources, resource]);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4 sm:p-6 bg-white">
      {/* Description Section */}
      <div className="text-center space-y-3">
        <p className="text-gray-500 text-lg sm:text-base">
        Drop your vibes & fave learning hacks!
        </p>
      </div>

      {/* Areas of Interest */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Areas of Interest</h3>
        <div className="flex flex-wrap gap-2">
          {areasOfInterest.map((interest, index) => (
            <motion.div
              key={index}
              className={`flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium shadow-md transition-all duration-200 hover:bg-gray-200 ${
                index % 2 === 0 ? "animate-floatEven" : "animate-floatOdd"
              }`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>{interest}</span>
              <button
                onClick={() => handleRemoveInterest(interest)}
                className="ml-2 text-gray-500 hover:text-gray-900"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add an area of interest"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
          <motion.button
            onClick={handleAddInterest}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all"
          >
            Add
          </motion.button>
        </div>
      </div>

      {/* Preferred Resources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Preferred Resources</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["Videos", "Articles", "Blogs", "Podcasts", "Online Courses", "E-Books", "Webinars", "Community Forums"].map(
            (resource, index) => (
              <motion.button
                key={resource}
                onClick={() => handleResourceChange(resource)}
                whileHover={{ scale: 1.05 }}
                className={`p-3 sm:p-4 rounded-full text-sm font-medium transition-all duration-200 shadow-md ${
                  preferredResources.includes(resource)
                    ? "bg-gray-900 text-white shadow-xl"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                } ${index % 2 === 0 ? "animate-floatEven" : "animate-floatOdd"}`}
              >
                {resource}
              </motion.button>
            )
          )}
        </div>
      </div>
      <div className="text-center">
                <p className="text-sm text-gray-500">Your preferences help us tailor your learning journey.</p>
            </div>
    </div>
  );
};
