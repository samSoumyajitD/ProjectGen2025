"use client";
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Award, 
  RefreshCcw,
  Trophy,
  Share2,
  Target,
  BookOpen,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Link from "next/link";
const FQuizW: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const quizData: QuizData = {
    "Week 1": [
      {
        "question_number": 1,
        "question_text": "1. What is an array in programming?",
        "options": {
          "A": "Option missing",
          "B": "A collection of variables that can be accessed individually",
          "C": "A single variable that can hold multiple values",
          "D": "A function that performs a specific task"
        },
        "correct_answer": "B"
      },
      {
        "question_number": 2,
        "question_text": "2. Which of the following is not a basic algorithm?",
        "options": {
          "A": "Option missing",
          "B": "Searching",
          "C": "Sorting",
          "D": "Addition"
        },
        "correct_answer": "C"
      },
      {
        "question_number": 3,
        "question_text": "3. What does time complexity measure in algorithms?",
        "options": {
          "A": "Option missing",
          "B": "The space required by an algorithm",
          "C": "The number of operations performed by an algorithm",
          "D": "The accuracy of an algorithm"
        },
        "correct_answer": "B"
      },
      {
        "question_number": 4,
        "question_text": "4. Which of the following is the time complexity of a linear search algorithm in the worst case?",
        "options": {
          "A": "Option missing",
          "B": "O(1)",
          "C": "O(log n)",
          "D": "O(n)"
        },
        "correct_answer": "C"
      },
      {
        "question_number": 5,
        "question_text": "5. Which of the following is the time complexity of a binary search algorithm in the worst case?",
        "options": {
          "A": "Option missing",
          "B": "O(1)",
          "C": "O(log n)",
          "D": "O(n)"
        },
        "correct_answer": "B"
      }
    ]
  };

  const questions: Question[] = quizData["Week 1"];

  const handleAnswer = (answer: string): void => {
    const isCorrect = answer === questions[currentQuestion].correct_answer;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: { selected: answer, isCorrect }
    });
    
    if (isCorrect) {
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setShowModal(true);
    }
  };

  const resetQuiz = (): void => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setStreak(0);
    setShowModal(false);
  };

  const calculateScore = (): number => {
    const correct = Object.values(selectedAnswers).filter(answer => answer.isCorrect).length;
    return Math.round((correct / questions.length) * 100);
  };

  const ResultModal = () => {
    const score = calculateScore();
    const isPassing = score >= 60;

    if (isPassing) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative overflow-hidden">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-24 flex items-center justify-center">
              <Trophy className="text-white w-16 h-16" />
            </div>

            <div className="px-6 py-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Congratulations!
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="text-yellow-500 w-6 h-6" />
                <span className="text-2xl font-bold text-yellow-500">{score}%</span>
              </div>
              <p className="text-gray-600 mb-6">
                You've achieved an excellent score! Your dedication to learning has paid off.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Achievements Unlocked</h3>
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <Trophy className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Top Score</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Expert</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
              <Link href='/studentWelcome/academic/goals/roadmapid'>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                </Link>
                <button 
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative overflow-hidden">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-24 flex items-center justify-center">
              <Target className="text-white w-16 h-16" />
            </div>

            <div className="px-6 py-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Room for Growth!
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertCircle className="text-blue-500 w-6 h-6" />
                <span className="text-2xl font-bold text-blue-500">{score}%</span>
              </div>
              <p className="text-gray-600 mb-6">
                We've identified areas where you can strengthen your understanding. Don't worry - we've updated your learning path to help you succeed!
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Focus Areas</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-600">Core concepts need reinforcement</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Practice exercises recommended</span>
                  </div>
                </div>
              </div>
              <Link href='/studentWelcome/academic/goals/updatedroadmap'>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                View Updated Roadmap
                <ArrowRight className="w-4 h-4" />
              </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span className="font-medium">{streak} Streak!</span>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {questions[currentQuestion].question_text}
        </h2>

        <div className="space-y-4 mb-8">
          {Object.entries(questions[currentQuestion].options).map(([key, value]) => {
            if (value === "Option missing") return null;
            const isSelected = selectedAnswers[currentQuestion]?.selected === key;
            const showCorrect = isSelected && selectedAnswers[currentQuestion]?.isCorrect;
            const showIncorrect = isSelected && !selectedAnswers[currentQuestion]?.isCorrect;

            return (
              <button
                key={key}
                onClick={() => !selectedAnswers[currentQuestion] && handleAnswer(key)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  isSelected 
                    ? showCorrect 
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                } ${selectedAnswers[currentQuestion] ? 'cursor-default' : 'cursor-pointer'}`}
                disabled={!!selectedAnswers[currentQuestion]}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-gray-200">
                      {key}
                    </span>
                    {value}
                  </span>
                  {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {showIncorrect && <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {selectedAnswers[currentQuestion] && (
          <button
            onClick={nextQuestion}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full"
          >
            {currentQuestion === questions.length - 1 ? 'Show Results' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {showModal && <ResultModal />}
    </div>
  );
};

export default FQuizW;