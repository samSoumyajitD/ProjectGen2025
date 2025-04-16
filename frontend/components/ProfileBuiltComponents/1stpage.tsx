import React, { useState, useEffect } from "react";
import { FirstSubPageOne } from './onesubcomponents/1stsubpageone';
import { FirstSubPageTwo } from './onesubcomponents/1stsubpagetwo';
import { FirstSubPageThree } from './onesubcomponents/1stsubpagethree';
import { FirstSubPageFour } from './onesubcomponents/1stsubpagefour';
import { FirstSubPageFive } from './onesubcomponents/FirstSubPageFive';

export const FirstPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [organization, setOrganization] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [takeNotes, setTakeNotes] = useState('');
  const [learningType, setLearningType] = useState('');
  const [expertiseLevel, setExpertiseLevel] = useState('');
  const [prefersGroupLearning, setPrefersGroupLearning] = useState('');
  const [avatar, setAvatar] = useState('');
  const [preferredLearningTime, setPreferredLearningTime] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);
  const [preferredResources, setPreferredResources] = useState<string[]>([]);
  const [aboutYourself, setAboutYourself] = useState('');

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const personalInfo = { organization, currentPosition, fieldOfStudy, aboutYourself };
    const learningPrefs = { takeNotes, learningType, expertiseLevel, prefersGroupLearning };
    const profileInfo = { avatar, preferredLearningTime };
    const interests = { areasOfInterest, preferredResources };

    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    localStorage.setItem('learningPrefs', JSON.stringify(learningPrefs));
    localStorage.setItem('profileInfo', JSON.stringify(profileInfo));
    localStorage.setItem('interests', JSON.stringify(interests));
  }, [
    organization,
    currentPosition,
    fieldOfStudy,
    aboutYourself,
    takeNotes,
    learningType,
    expertiseLevel,
    prefersGroupLearning,
    avatar,
    preferredLearningTime,
    areasOfInterest,
    preferredResources,
  ]);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about yourself";
      case 2:
        return "Your learning preferences";
      case 3:
        return "Personalize your profile";
      case 4:
        return "Your interests and resources";
      case 5:
        return "About Yourself";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-medium tracking-tight text-gray-900">
              {getStepTitle()}
            </h1>
            <p className="text-gray-500">
              Step {currentStep} of 5
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="overflow-hidden h-1 bg-gray-100 rounded">
              <div
                className="h-full bg-gray-900 transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-12 transition-all duration-300 ease-in-out">
            {currentStep === 1 && (
              <FirstSubPageOne
                organization={organization}
                setOrganization={setOrganization}
                currentPosition={currentPosition}
                setCurrentPosition={setCurrentPosition}
                fieldOfStudy={fieldOfStudy}
                setFieldOfStudy={setFieldOfStudy}
              />
            )}

            {currentStep === 2 && (
              <FirstSubPageTwo
                takeNotes={takeNotes}
                setTakeNotes={setTakeNotes}
                learningType={learningType}
                setLearningType={setLearningType}
                expertiseLevel={expertiseLevel}
                setExpertiseLevel={setExpertiseLevel}
                prefersGroupLearning={prefersGroupLearning}
                setPrefersGroupLearning={setPrefersGroupLearning}
              />
            )}

            {currentStep === 3 && (
              <FirstSubPageThree
                avatar={avatar}
                setAvatar={setAvatar}
                preferredLearningTime={preferredLearningTime}
                setPreferredLearningTime={setPreferredLearningTime}
              />
            )}

            {currentStep === 4 && (
              <FirstSubPageFour
                areasOfInterest={areasOfInterest}
                setAreasOfInterest={setAreasOfInterest}
                preferredResources={preferredResources}
                setPreferredResources={setPreferredResources}
              />
            )}

            {currentStep === 5 && (
              <FirstSubPageFive
                aboutYourself={aboutYourself}
                setAboutYourself={setAboutYourself}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 5}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                currentStep === 5
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;