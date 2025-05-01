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
  // Assuming goal_id might be part of the initial fetch response,
  // although the backend `/get-quiz` endpoint doesn't show it.
  // If not, we must rely on getting it from the URL.
  // goal_id?: string; // Uncomment if backend provides this
}

// Interface for the evaluation response from the backend
interface EvaluationResponse {
  evaluation: any; // Or a more specific type based on backend response structure
  week: string;
}

const GiveQuizPage = () => {
  const params = useParams();
  const quizId = params.quizid as string;
  // Assume goalid is also a parameter in the URL path, e.g., /quiz/[quizid]/[goalid]
  const goalId = params.id as string;

  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]); // State to store user's answers
  const [evaluationResult, setEvaluationResult] = useState<any>(null); // State for evaluation result

  // --- Effect to fetch quiz data ---
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError("Quiz ID is missing.");
        setIsLoading(false);
        return;
      }
      // Add goalId check if needed, although it's only used for the evaluation POST.
      // If goalId is essential to even *start* the quiz, add a check here.

      try {
        const response = await axios.get<QuizResponse>(`http://127.0.0.1:5000/get-quiz/${quizId}`);
        setQuizData(response.data);
      } catch (err) {
        const error = err as AxiosError<{ error?: string }>;
        console.error("Axios error fetching quiz:", error);
        setError(error.response?.data?.error || "Something went wrong fetching the quiz.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]); // Depend on quizId to refetch if it changes

  // --- Effect for fullscreen change detection ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- Effect to update progress bar ---
  useEffect(() => {
    if (quizData && quizData.quiz.length > 0) {
      // Progress is based on completed questions (currentIndex)
      // For a smoother animation, progress updates *before* advancing index visually
      // However, the progress bar usually represents questions *answered*.
      // Let's calculate based on the question we are *currently* on.
      // Or, calculate based on the *next* question index after a submission.
      // Let's calculate based on the question *to be answered next*, to fill up
      // as the current one is finished.
      const nextProgress = ((currentIndex) / quizData.quiz.length) * 100; // Use currentIndex for completed questions
       if (currentIndex === 0 && userAnswers.length === 0) {
           setProgress(0); // Start at 0
       } else if (quizData.quiz.length > 0) {
            // Calculate progress based on number of answers recorded
            setProgress(((userAnswers.length) / quizData.quiz.length) * 100);
       }

    } else {
        setProgress(0);
    }
  }, [userAnswers.length, quizData]); // Depend on number of answers and quiz data


  // --- Fullscreen handlers ---
  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(console.error);
  };

  const exitFullscreen = () => {
    document.exitFullscreen?.();
  };

  // --- Function to submit answers to backend for evaluation ---
  const submitQuizForEvaluation = async (finalAnswers: string[]) => {
      if (!quizId || !goalId) {
          setError("Quiz ID or Goal ID is missing for submission.");
          setIsSubmitting(false);
          return;
      }
      setIsSubmitting(true);
      setError(null); // Clear previous errors

      try {
          const response = await axios.post<EvaluationResponse>(`http://127.0.0.1:5000/eval/${quizId}/${goalId}`, {
              user_answers: finalAnswers,
          });
          setEvaluationResult(response.data.evaluation);
          exitFullscreen();
          setQuizCompleted(true); // Mark quiz as completed only after successful submission
      } catch (err) {
          const error = err as AxiosError<{ error?: string }>;
          console.error("Axios error submitting quiz:", error);
          // Display a submission error message
          setError(error.response?.data?.error || "Failed to submit quiz. Please try again.");
          // Decide how to handle failure: stay on last question? Show error overlay?
          // For now, set error and keep quizCompleted false. User can try submitting again.
          setQuizCompleted(false); // Ensure quiz isn't marked complete on submission failure
      } finally {
          setIsSubmitting(false);
      }
  };


  // --- Handle "Next Question" or "Complete Quiz" button click ---
  const handleSubmit = () => {
    if (!selectedOption || isSubmitting || !quizData) return;

    // Record the selected answer for the current question
    const nextUserAnswers = [...userAnswers, selectedOption];
    setUserAnswers(nextUserAnswers);

    // Clear selected option for the next question
    setSelectedOption(null);

    const totalQuestions = quizData.quiz.length;
    const isLastQuestion = currentIndex === totalQuestions - 1;

    setIsSubmitting(true); // Start submitting state for visual feedback (even just moving to next)

    // Simulate a brief delay before moving to the next question or submitting
    setTimeout(() => {
      if (!isLastQuestion) {
        // Move to the next question
        setCurrentIndex(currentIndex + 1);
        setIsSubmitting(false); // End submitting state after moving
      } else {
        // This was the last question, submit the quiz for evaluation
        submitQuizForEvaluation(nextUserAnswers); // Pass the final answers
        // setIsSubmitting state will be managed inside submitQuizForEvaluation
      }
    }, 600); // Short delay for transition effect
  };

  // --- Render States ---

  // Error state (covers fetch and submit errors)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center"
        >
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-xl font-semibold text-center mb-2">Error</h1>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-full bg-blue-500 text-white font-medium transition hover:bg-blue-600 active:bg-blue-700"
          >
            Try Again
          </button>
           {/* Optionally add a back button */}
           {/* <button
             onClick={() => window.history.back()}
             className="mt-4 w-full py-3 rounded-full bg-gray-200 text-gray-800 font-medium transition hover:bg-gray-300"
           >
             Go Back
           </button> */}
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Loading your quiz...</p>
      </div>
    );
  }

  // No data state
  if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
     // This state should ideally not be reached if fetch error is handled,
     // but good as a fallback if quizData is null/empty after loading.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-8 text-center w-full max-w-md"
        >
          <div className="flex items-center justify-center text-yellow-500 mb-4">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-xl font-semibold mb-2">No Questions Available</h1>
          <p className="text-gray-600 mb-6">The quiz you're looking for doesn't contain any questions or couldn't be loaded properly.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-full bg-blue-500 text-white font-medium transition hover:bg-blue-600 active:bg-blue-700"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }


  const { week, quiz } = quizData;
  const currentQuiz = quiz[currentIndex];
  const totalQuestions = quiz.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;


  // Quiz Completed State (after successful submission)
 // Quiz Completed State (after successful submission)
if (quizCompleted) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>
        
        <div className="relative z-10">
          {/* Animated checkmark */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center text-green-500 mb-6 mx-auto w-20 h-20"
          >
            <CheckCircle size={80} strokeWidth={1.5} />
          </motion.div>

          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Great Job!
          </motion.h1>

          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-6 text-lg"
          >
            You've successfully completed the Week {week} quiz!
          </motion.p>

          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-700 mb-8 px-4 italic"
          >
            "Every attempt brings you one step closer to mastery. Keep up the great work!"
          </motion.p>

          

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => {
                // Navigate to evaluation page
                window.location.href = `/studentWelcome/academic/goals/${goalId}/givequiz/${quizId}`;
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium transition-all hover:from-blue-600 hover:to-indigo-600 active:scale-95 shadow-md hover:shadow-lg w-full"
            >
              View Detailed Evaluation
            </button>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4"
          >
        
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

  // Pre-quiz / Fullscreen prompt state
  if (!isFullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-8 text-center w-full max-w-md"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Week {week} Quiz</h1>
            <p className="text-gray-600">This quiz contains {totalQuestions} questions.</p>
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
      </div>
    );
  }

  // In-quiz state (Fullscreen)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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
            disabled={isSubmitting} // Disable exit during submission
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-1">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: `${(userAnswers.length / totalQuestions) * 100}%` }} // Base initial width on answers recorded
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>

        {/* Question */}
        <div className="px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex} // Use currentIndex as key for animation
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
                    onClick={() => !isSubmitting && setSelectedOption(key)} // Disable click during submission
                    className={`flex items-center gap-4 border-2 px-5 py-4 rounded-xl transition ${
                      selectedOption === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isSubmitting ? 'pointer-events-none opacity-70' : 'cursor-pointer'}`}
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
                {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
                {selectedOption && <ChevronRight className="ml-1" size={18} />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiveQuizPage;