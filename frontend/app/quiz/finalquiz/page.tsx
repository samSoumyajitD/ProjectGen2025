"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Award,
  Trophy,
  Target,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
const FQuizW: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const quizData = [
    {
        "question_number": 1,
        "question_text": "1. What is the name of the data structure that stores elements in a doubly-linked list format, allowing for efficient insertion and deletion of nodes?",
        "options": {
            "A": "Arrays",
            "B": "Linked Lists",
            "C": "Queues",
            "D": "Stacks"
        },
        "correct_answer": "B"
    },
    {
        "question_number": 2,
        "question_text": "2. Which of the following is a tree traversal method that visits nodes in a depth-first order, using a stack data structure?",
        "options": {
            "A": "Breadth-first search",
            "B": "Depth-first search (DFS) using recursion",
            "C": "Depth-first search (DFS) using a stack",
            "D": "Level-order traversal"
        },
        "correct_answer": "C"
    },
    {
        "question_number": 3,
        "question_text": "3. In the context of dynamic programming, what is the purpose of memoization?",
        "options": {
            "A": "Storing intermediate results to avoid redundant calculations",
            "B": "Sorting an array in descending order",
            "C": "Converting a recursive algorithm to an iterative one",
            "D": "Implementing a binary search tree"
        },
        "correct_answer": "A"
    },
    {
        "question_number": 4,
        "question_text": "4. Which of the following is a graph algorithm that finds the shortest path between two nodes in a weighted graph?",
        "options": {
            "A": "Dijkstra's algorithm",
            "B": "Breadth-first search",
            "C": "Depth-first search",
            "D": "Bellman-Ford algorithm"
        },
        "correct_answer": "A"
    },
    {
        "question_number": 5,
        "question_text": "5. What is the time complexity of searching for an element in an unsorted array of size n using a linear search algorithm?",
        "options": {
            "A": "O(log n)",
            "B": "O(n)",
            "C": "O(n log n)",
            "D": "O(n^2)"
        },
        "correct_answer": "B"
    },
    {
        "question_number": 6,
        "question_text": "6. Which of the following is a binary tree traversal method that visits nodes in a left-to-right order, using a stack data structure?",
        "options": {
            "A": "Pre-order traversal",
            "B": "In-order traversal",
            "C": "Post-order traversal",
            "D": "Level-order traversal"
        },
        "correct_answer": "B"
    },
    {
        "question_number": 7,
        "question_text": "7. What is the name of the algorithm that finds the longest common subsequence between two strings?",
        "options": {
            "A": "Dynamic programming",
            "B": "Greedy algorithms",
            "C": "Tabulation",
            "D": "Memoization"
        },
        "correct_answer": "A"
    },
    {
        "question_number": 8,
        "question_text": "8. Which of the following is a data structure that stores elements in a last-in, first-out (LIFO) order?",
        "options": {
            "A": "Array",
            "B": "Queue",
            "C": "Stack",
            "D": "Linked List"
        },
        "correct_answer": "C"
    },
    {
        "question_number": 9,
        "question_text": "9. What is the time complexity of inserting an element at the beginning of a linked list?",
        "options": {
            "A": "O(1)",
            "B": "O(log n)",
            "C": "O(n)",
            "D": "O(n log n)"
        },
        "correct_answer": "A"
    },
    {
        "question_number": 10,
        "question_text": "10. Which of the following is a graph algorithm that finds the minimum spanning tree of a connected, undirected graph?",
        "options": {
            "A": "Prim's algorithm",
            "B": "Kruskal's algorithm",
            "C": "Depth-first search",
            "D": "Breadth-first search"
        },
        "correct_answer": "A"
    }
]

  const handleAnswer = (answer: string): void => {
    const isCorrect = answer === quizData[currentQuestion].correct_answer;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: { selected: answer, isCorrect },
    }));
    setStreak(isCorrect ? streak + 1 : 0);
  };

  const nextQuestion = (): void => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTimeout(() => setShowResults(true), 7000); // Show result screen after 7 seconds
    }
  };

  const resetQuiz = (): void => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setStreak(0);
  };

  const calculateScore = (): number => {
    const correct = Object.values(selectedAnswers).filter((answer) => answer.isCorrect).length;
    return Math.round((correct / quizData.length) * 100);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Quiz</h1>
        {!showResults ? (
          <>
            <p className="text-lg font-semibold text-gray-700 mb-3">{quizData[currentQuestion].question_text}</p>
            <div className="grid gap-3 mb-6">
              {Object.entries(quizData[currentQuestion].options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  className={`py-2 px-4 rounded-lg border transition text-left ${
                    selectedAnswers[currentQuestion]?.selected === key
                      ? selectedAnswers[currentQuestion]?.isCorrect
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-red-100 border-red-500 text-red-700"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <button
              onClick={nextQuestion}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
            >
              {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className={`h-24 flex items-center justify-center ${calculateScore() >= 60 ? "bg-green-500" : "bg-red-500"}`}>
              {calculateScore() >= 60 ? <Trophy className="text-white w-16 h-16" /> : <Target className="text-white w-16 h-16" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              {calculateScore() >= 60 ? "Congratulations!" : "Room for Improvement!"}
            </h2>
            <p className="text-lg font-semibold text-gray-700 mt-2">Score: {calculateScore()}%</p>
            <p className="text-gray-600 mt-4">
              {calculateScore() >= 60 ? "Great job! Keep up the good work." : "Keep practicing! You'll get there."}
            </p>
            <div className="mt-6 flex gap-3 justify-center">
            <Link href='/studentWelcome/academic/goals/updatedroadmap'>
              <button  className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition">
              Updated Roadmaps
              </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FQuizW;