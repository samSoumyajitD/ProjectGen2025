"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

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

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get<QuizResponse>(`http://127.0.0.1:5000/get-quiz/${quizId}`);
        console.log("Quiz data:", response.data);
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

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(console.error);
  };

  const exitFullscreen = () => {
    document.exitFullscreen?.();
  };

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (isLoading) return <div className="p-4">Loading quiz...</div>;

  if (!quizData || quizData.quiz.length === 0) {
    return <div className="p-4">No questions available.</div>;
  }

  const { week, quiz } = quizData;
  const currentQuiz = quiz[currentIndex];

  const handleSubmit = () => {
 
    setSelectedOption(null);
    if (currentIndex < quiz.length - 1  ) {
      setCurrentIndex(currentIndex + 1);

    } else {
      exitFullscreen();

      alert('Quiz completed!');
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!isFullscreen ? (
        <div className="bg-white rounded-xl shadow-xl p-8 text-center w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Weekly Quiz</h1>
          <p className="text-gray-600 mb-6">Click the button below to enter fullscreen mode and begin the quiz.</p>
          <button
            onClick={enterFullscreen}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            Start Quiz (Fullscreen Mode)
          </button>
        </div>
      ) : (
        <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Week {week} Quiz</h1>
            <button
              onClick={exitFullscreen}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold"
            >
              Exit Quiz
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">{currentQuiz.question}</h2>
            <div className="space-y-3">
              {Object.entries(currentQuiz.options).map(([key, option]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 border px-4 py-3 rounded-lg cursor-pointer transition hover:bg-blue-50 ${
                    selectedOption === key ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quizOption"
                    value={key}
                    checked={selectedOption === key}
                    onChange={() => setSelectedOption(key)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={!selectedOption}
            onClick={handleSubmit}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              selectedOption
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentIndex < quiz.length - 1 ? 'Next Question' : 'Submit Answer'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GiveQuizPage;
