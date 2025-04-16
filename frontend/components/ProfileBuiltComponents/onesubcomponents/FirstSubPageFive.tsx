import React from 'react';

interface FirstSubPageFiveProps {
  aboutYourself: string;
  setAboutYourself: (value: string) => void;
}

export const FirstSubPageFive: React.FC<FirstSubPageFiveProps> = ({
  aboutYourself,
  setAboutYourself,
}) => {
  // Function to calculate word count
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = getWordCount(aboutYourself);

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    const newWordCount = getWordCount(inputText);

    // Only update the state if the word count is 50 or less
    if (newWordCount <= 50) {
      setAboutYourself(inputText);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Description Section */}
      <div className="text-center space-y-4">
      
        <p className="text-gray-500 text-lg sm:text-base">
        Craft a slick 50-word bio that screams you!
        </p>
      </div>

      {/* Form Field */}
      <div className="space-y-6">
        <div className="relative group">
          <textarea
            value={aboutYourself}
            onChange={handleInputChange}
            className="w-full px-4 py-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-[16px] bg-white shadow-sm"
            placeholder=" "
            rows={4}
          />
          <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-200 pointer-events-none group-focus-within:text-gray-500 group-focus-within:top-1 group-focus-within:text-xs">
            About Yourself
          </label>
        </div>

        {/* Word Count Display */}
        <div
          className={`text-right text-sm ${
            wordCount > 50 ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {wordCount} / 50 words
        </div>

        {/* Error Message */}
        {wordCount > 50 && (
          <div className="text-right text-sm text-red-500">
            Maximum 50 words allowed.
          </div>
        )}
      </div>

      {/* Optional Helper Text */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          This helps us understand you better.
        </p>
      </div>
    </div>
  );
};