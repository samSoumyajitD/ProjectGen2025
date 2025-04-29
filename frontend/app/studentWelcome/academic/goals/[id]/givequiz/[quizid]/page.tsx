"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, X, AlertTriangle, Loader2 } from 'lucide-react';

interface Quiz {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

interface QuizResponse {
  quiz: Quiz[]; // array of questions
  week: string;
}

const GiveQuizPage = () => {
  const params = useParams();
  const quizId = params.quizid as string;

  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get<QuizResponse>(`http://127.0.0.1:5000/get-quiz/${quizId}`);

        setQuizData(response.data);
      } catch (err) {
        const error = err as AxiosError<{ error?: string }>;
        console.error("Axios error:", error);
        setError(error.response?.data?.error || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (quizData && quizData.quiz.length > 0) {
      setProgress(((currentIndex + 1) / quizData.quiz.length) * 100);
    }
  }, [currentIndex, quizData]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(console.error);
  };

  const exitFullscreen = () => {
    document.exitFullscreen?.();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate a brief submission delay for UX
    setTimeout(() => {
      setSelectedOption(null);
      setIsSubmitting(false);
      
      if (currentIndex < (quizData?.quiz.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        exitFullscreen();
        setQuizCompleted(true);
      }
    }, 600);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-xl font-semibold text-center mb-2">Unable to Load Quiz</h1>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-full bg-blue-500 text-white font-medium transition hover:bg-blue-600 active:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Loading your quiz...</p>
      </div>
    );
  }

  if (!quizData || quizData.quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center text-yellow-500 mb-4">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-xl font-semibold mb-2">No Questions Available</h1>
          <p className="text-gray-600 mb-6">The quiz you're looking for doesn't contain any questions.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-full bg-blue-500 text-white font-medium transition hover:bg-blue-600 active:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { week, quiz } = quizData;
  const currentQuiz = quiz[currentIndex];
  const totalQuestions = quiz.length;

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center"
        >
          <div className="flex items-center justify-center text-green-500 mb-6">
            <CheckCircle size={60} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Quiz Completed!</h1>
          <p className="text-gray-600 mb-8">You've successfully completed the Week {week} quiz.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-full bg-blue-500 text-white font-medium transition hover:bg-blue-600 active:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {!isFullscreen ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-8 text-center w-full max-w-md"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Week {week} Quiz</h1>
            <p className="text-gray-600">This quiz contains {totalQuestions} questions</p>
          </div>
          
          <div className="mb-8 bg-blue-50 rounded-2xl p-6">
            <div className="flex items-center justify-center text-blue-500 mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V4C8.13401 4 5 7.13401 5 11V16.5C5 17.3284 5.67157 18 6.5 18H17.5C18.3284 18 19 17.3284 19 16.5V11C19 7.13401 15.866 4 12 4Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 20C15 21.6569 13.6569 23 12 23C10.3431 23 9 21.6569 9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Focus Mode Required</h2>
            <p className="text-gray-600 text-sm">For the best quiz experience, this quiz will run in fullscreen mode.</p>
          </div>
          
          <button
            onClick={enterFullscreen}
            className="w-full py-4 rounded-full bg-blue-500 text-white font-medium transition hover:bg-blue-600 active:bg-blue-700 shadow-md flex items-center justify-center"
          >
            <span>Begin Quiz</span>
            <ChevronRight className="ml-1" size={18} />
          </button>
        </motion.div>
      ) : (
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 px-6 py-5 text-white flex justify-between items-center">
            <div>
              <h1 className="font-semibold">Week {week} Quiz</h1>
              <p className="text-sm text-blue-100">Question {currentIndex + 1} of {totalQuestions}</p>
            </div>
            <button
              onClick={exitFullscreen}
              className="rounded-full p-2 hover:bg-blue-600 transition"
              aria-label="Exit Quiz"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-100 h-1">
            <motion.div 
              className="h-full bg-green-500" 
              initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          
          {/* Question */}
          <div className="px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-medium text-gray-800 mb-6">{currentQuiz.question}</h2>
                
                {/* Options */}
                <div className="space-y-3 mb-8">
                  {Object.entries(currentQuiz.options).map(([key, option]) => (
                    <motion.div
                      key={key}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOption(key)}
                      className={`flex items-center gap-4 border-2 px-5 py-4 rounded-xl cursor-pointer transition ${
                        selectedOption === key 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                        selectedOption === key 
                          ? 'border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === key && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-blue-500 rounded-full" 
                          />
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              disabled={!selectedOption || isSubmitting}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-full font-medium transition flex items-center justify-center ${
                selectedOption && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {currentIndex < quiz.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  {selectedOption && <ChevronRight className="ml-1" size={18} />}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiveQuizPage;