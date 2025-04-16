import React from 'react';

interface FirstPageProps {
  organization: string;
  setOrganization: (value: string) => void;
  currentPosition: string;
  setCurrentPosition: (value: string) => void;
  fieldOfStudy: string;
  setFieldOfStudy: (value: string) => void;
}

export const FirstSubPageOne: React.FC<FirstPageProps> = ({
  organization,
  setOrganization,
  currentPosition,
  setCurrentPosition,
  fieldOfStudy,
  setFieldOfStudy,
}) => {
  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Description Section */}
      <div className="text-center space-y-2">
        <p className="text-gray-500 text-lg sm:text-base">
        Yo! Share your deets, let's glitch up your vibe. Custom mode: ON
         </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="relative group">
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full px-0 pt-6 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-[16px] bg-transparent"
            placeholder=" "
          />
          <label className="absolute left-0 -top-2 text-lg font-semibold text-gray-900 transition-all duration-200 group-focus-within:text-blue-500">
            Organization
          </label>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={currentPosition}
            onChange={(e) => setCurrentPosition(e.target.value)}
            className="w-full px-0 pt-6 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-[16px] bg-transparent"
            placeholder=" "
          />
          <label className="absolute left-0 -top-2 text-lg font-semibold text-gray-900 transition-all duration-200 group-focus-within:text-blue-500">
            Current Position
          </label>
        </div>

        <div className="relative group">
          <input
            type="text"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            className="w-full px-0 pt-6 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-[16px] bg-transparent"
            placeholder=" "
          />
          <label className="absolute left-0 -top-2 text-lg font-semibold text-gray-900 transition-all duration-200 group-focus-within:text-blue-500">
            Field of Study
          </label>
        </div>
      </div>

      {/* Optional Helper Text */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          This information helps us tailor content to your professional needs
        </p>
      </div>
    </div>
  );
};