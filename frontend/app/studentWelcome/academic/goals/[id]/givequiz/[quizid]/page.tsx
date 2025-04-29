'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const GiveQuizPage = () => {
  const params = useParams();
  const quizId = params.quizid as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get-quiz/${quizId}`);
        setQuiz(response.data.quiz);
      } catch (err: any) {
        console.error("Axios error:", err);
        setError(err.response?.data?.error || "Something went wrong");
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  const enterFullscreen = () => {
    const docElm = document.documentElement as any; // Cast to 'any' to access vendor-prefixed methods

    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) { // Firefox
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) { // Chrome, Safari, Opera
      docElm.webkitRequestFullscreen();
    } else if (docElm.msRequestFullscreen) { // IE/Edge
      docElm.msRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    const doc = document as any; // Cast document to 'any' to access vendor-prefixed methods

    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) { // Firefox
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) { // Chrome, Safari, Opera
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) { // IE/Edge
      doc.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  if (error) return <div>Error: {error}</div>;
  if (!quiz) return <div>Loading quiz...</div>;

  return (
    <div className={isFullscreen ? 'fullscreen' : ''}>
      {!isFullscreen && (
        <div className="text-center mb-4">
          <button
            onClick={enterFullscreen}
            className="bg-blue-600 text-white font-bold text-lg py-2 px-4 rounded-lg"
          >
            Give Access (Fullscreen)
          </button>
        </div>
      )}
      
      <div className="quiz-container p-6">
        <h1 className="text-3xl font-bold mb-6">Quiz: {quiz.title}</h1>
        <pre>{JSON.stringify(quiz, null, 2)}</pre>

        {isFullscreen && (
          <button
            onClick={exitFullscreen}
            className="absolute top-4 right-4 bg-red-600 text-white font-semibold px-4 py-2 rounded-full"
          >
            Exit Fullscreen
          </button>
        )}
      </div>
    </div>
  );
};

export default GiveQuizPage;
