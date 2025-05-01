"use client";
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Award, Trophy,  ArrowLeft, Sparkles, CheckCircle, XCircle } from 'lucide-react';

interface Quiz {
  week: string;
  quizId: string;
  score: string;
}

interface QuestionFeedback {
  question: string;
  correct_ans: string;
  verdict: 'correct' | 'incorrect';
  explanation: string;
}

interface EvaluationResult {
  feedback: QuestionFeedback[];
  score: string;
}

const EvaluationPage = () => {
  const params = useParams();
  const { id, quizid } = params as { id: string; quizid: string };

  const [goalName, setGoalName] = useState('');
  const [attemptedQuizWeeks, setAttemptedQuizWeeks] = useState<Quiz[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [evalData, setEvalData] = useState<EvaluationResult | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [goalRes, quizzesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/get-goal-name/${id}`),
          axios.get(`http://127.0.0.1:5000/get-attempted-quizzes/${id}`)
        ]);

        setGoalName(goalRes.data.goalName);
        setAttemptedQuizWeeks(quizzesRes.data.quizzes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (quizId: string) => {
    setModalLoading(true);
    setShowModal(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get-eval/${quizId}`);
      const raw = response.data.evaluation;
      const scoreEntry = raw.find((item: any) => item.score !== undefined);
      const questionFeedback = raw.filter((item: any) => item.score === undefined);

      setEvalData({
        feedback: questionFeedback,
        score: scoreEntry?.score ?? "0/0",
      });
    } catch (error) {
      console.error("Error fetching evaluation:", error);
      setEvalData(null);
    } finally {
      setModalLoading(false);
    }
  };

  const calculatePercentage = (score: string) => {
    const [obtained, total] = score.split('/').map(Number);
    return Math.round((obtained / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <Award size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{goalName || 'Your Learning Journey'}</h1>
          <p className="text-blue-600">See how you're doing on your quizzes</p>
        </div>
      </motion.div>

      {/* Quiz Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-12 h-12 rounded-full border-4 border-blue-400 border-t-transparent"
          />
          <p className="ml-4 text-blue-600 font-medium">Loading your progress...</p>
        </div>
      ) : attemptedQuizWeeks && attemptedQuizWeeks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {attemptedQuizWeeks.map((quiz, index) => {
            const percentage = calculatePercentage(quiz.score);
            return (
              <motion.div
                key={quiz.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      index % 3 === 0 ? 'bg-blue-100 text-blue-800' :
                      index % 3 === 1 ? 'bg-purple-100 text-purple-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      Week {quiz.week}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                      <Trophy size={16} />
                    </div>
                  </div>
                  <div className="h-24 mb-6 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-semibold ${
                        index % 3 === 0 ? 'bg-blue-100 text-blue-600' :
                        index % 3 === 1 ? 'bg-purple-100 text-purple-600' :
                        'bg-indigo-100 text-indigo-600'
                      }`}
                    >
                      {percentage}%
                    </motion.div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubmit(quiz.quizId)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white ${
                      index % 3 === 0 ? 'bg-blue-500 hover:bg-blue-600' :
                      index % 3 === 1 ? 'bg-purple-500 hover:bg-purple-600' :
                      'bg-indigo-500 hover:bg-indigo-600'
                    }`}
                  >
                    View Results
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto border border-gray-100"
        >
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-500">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No quizzes yet!</h3>
          <p className="text-gray-600 mb-6">Complete some quizzes to see your progress here</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            Start Learning
          </button>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full max-w-xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-slate-100 p-6 bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
                      <Trophy size={20} />
                    </div>
                    <div>
                     
                      {evalData && (
                        <p className="text-slate-500 font-medium">Score: <span className="text-blue-600 font-semibold">{evalData.score}</span></p>
                      )}
                    </div>
                  </div>
                 
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[60vh] p-1">
                {modalLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-12 h-12 rounded-full border-4 border-blue-400 border-t-transparent"
                    />
                    <p className="text-blue-600 font-medium">Loading your results...</p>
                  </div>
                ) : evalData ? (
                  <div className="space-y-6 p-6">
                    {evalData.feedback.map((q, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`rounded-2xl shadow-sm border p-5 ${
                          q.verdict === 'correct' 
                            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100' 
                            : 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-100'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`mt-1 p-1.5 rounded-full ${
                            q.verdict === 'correct' ? 'text-emerald-500' : 'text-rose-500'
                          }`}>
                            {q.verdict === 'correct' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800">Q{idx + 1}: {q.question}</p>
                            <p className={`text-sm font-medium mt-1 ${
                              q.verdict === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {q.verdict === 'correct' ? 'Correct Answer' : 'Incorrect Answer'}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-xl mt-2 bg-white bg-opacity-60 backdrop-blur-sm ${
                          q.verdict === 'correct' ? 'border border-emerald-100' : 'border border-rose-100'
                        }`}>
                          <p className="text-sm font-medium text-slate-700">
                            <span className="font-bold">Correct Answer:</span> {q.correct_ans}
                          </p>
                        </div>
                        
                        <div className="mt-4 text-sm text-slate-700 bg-white bg-opacity-50 backdrop-blur-sm p-4 rounded-xl border border-slate-100">
                          <p className="font-medium mb-1">Explanation:</p>
                          <p>{q.explanation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <XCircle size={28} className="text-red-500" />
                    </div>
                    <p className="text-slate-700 font-medium">Unable to load evaluation results</p>
                    <p className="text-slate-500 text-sm mt-2">Please try again later</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-100 p-4 flex justify-end bg-gradient-to-r from-slate-50 to-blue-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-sm text-gray-500"
      >
        <p>Keep going! Every quiz makes you smarter 💡</p>
      </motion.div>
    </div>
  );
};

export default EvaluationPage;