import type React from "react";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex flex-col items-center w-full py-6">
      {/* Progress Bar Container */}
      <div className="flex items-center justify-between relative w-full max-w-2xl">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-200 rounded-full transform -translate-y-1/2" />

        {/* Animated Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-[3px] bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Steps */}
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full 
                  transition-all duration-300 ease-in-out cursor-pointer
                  ${
                    isCompleted
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : isCurrent
                      ? "bg-white border-2 border-blue-500 shadow-lg hover:shadow-xl"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </div>

           
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;