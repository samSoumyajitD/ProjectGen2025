'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import YouTube from 'react-youtube';
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";


const GoalPage = () => {
  const params = useParams();
  const goalId = params.id as string;

  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizType, setQuizType] = useState<'week' | 'final' | null>(null);
  const [quizWeek, setQuizWeek] = useState<number | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);

  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setIsLoading(true);
        const userCookie = Cookies.get("user");
        if (!userCookie) {
          setError("User not authenticated");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userCookie);
        const userId = user.id;

        const res = await axios.get(`http://127.0.0.1:5000/get-roadmap/${userId}/${goalId}`, {
          withCredentials: true,
        });

        const filteredRoadmap = res.data.roadmap.filter((week: any) => week.week && week.topics?.length > 0);
        filteredRoadmap.sort((a: any, b: any) => a.week - b.week);
        setRoadmap(filteredRoadmap);
      } catch (err: any) {
        console.error("Error fetching roadmap data:", err);
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [goalId]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const openVideoModal = (url: string) => {
    setSelectedVideo(url);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const openQuizModal = (type: 'week' | 'final', week?: number) => {
    setQuizType(type);
    setQuizWeek(week || null);
    setIsQuizModalOpen(true);
    setQuizGenerated(false);
    setQuizId(null);
  };

  const closeQuizModal = () => {
    setIsQuizModalOpen(false);
    setQuizType(null);
    setQuizWeek(null);
    setQuizGenerated(false);
    setQuizId(null);
  };

  const toggleWeekExpand = (week: number) => {
    setExpandedWeeks(prev => ({ ...prev, [week]: !prev[week] }));
  };

  const generateQuiz = async () => {
    try {
      setIsGeneratingQuiz(true);
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        setError("User not authenticated");
        return;
      }

      const user = JSON.parse(userCookie);
      const userId = user.id;

      const endpoint = `http://127.0.0.1:5000/generate-quiz/${userId}/${goalId}`;
      const payload = quizType === 'week' ? { week: quizWeek } : {};

      const response = await axios.post(endpoint, payload, {
        withCredentials: true
      });

      // Mark quiz as generated and store quiz ID if needed
      setQuizGenerated(true);
      setQuizId(response.data.quizId|| null);
      
      // console.log("Quiz generated successfully:", response.data);
    } catch (err: any) {
      console.error("Error generating quiz:", err);
      setError(err.response?.data?.error || "Failed to generate quiz");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };
  const router = useRouter();
 
  const handleAttemptQuiz = () => {
    if (quizId) {
      router.push(`/studentWelcome/academic/goals/${goalId}/givequiz/${quizId}`);
    }
   
  };

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🚀 Your Learning Roadmap
      </h1>

      {roadmap.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>No roadmap data available for this goal.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roadmap.map((weekData) => {
            const isExpanded = expandedWeeks[weekData.week];
            return (
              <div
                key={weekData.week}
                className="bg-white dark:bg-gray-900 rounded-[20px] shadow-md hover:shadow-xl transition-shadow overflow-hidden border dark:border-gray-700"
              >
                {/* Header */}
                <div
                  onClick={() => toggleWeekExpand(weekData.week)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 px-6 py-4 flex justify-between items-center cursor-pointer"
                >
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">
                    Week {weekData.week}
                  </h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuizModal('week', weekData.week);
                      }}
                      className="bg-white text-blue-700 font-semibold text-sm px-5 py-2 rounded-full shadow hover:bg-gray-100 transition hover:scale-105"
                    >
                      Take Quiz
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="text-white" />
                    ) : (
                      <ChevronDown className="text-white" />
                    )}
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="p-6 space-y-8 animate-fadeIn">
                    {/* Goals */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">🎯 Weekly Goals</h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 pl-2">
                        {weekData.goals?.map((goal: string, index: number) => (
                          <li key={index}>{goal}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">📚 Topics Covered</h3>
                      <div className="flex flex-wrap gap-3">
                        {weekData.topics?.map((topic: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-4 py-2 rounded-full font-medium shadow"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Videos */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">🎥 Recommended Videos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {weekData.suggested_yt_videos?.map((video: string, index: number) => {
                          const videoId = extractVideoId(video);
                          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';

                          return (
                            <div
                              key={index}
                              onClick={() => openVideoModal(video)}
                              className="cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-105"
                            >
                              <div className="relative w-full h-40">
                                {thumbnailUrl && (
                                  <img
                                    src={thumbnailUrl}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="p-4 text-left">
                                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                  {video}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Final Assessment Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => openQuizModal('final')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition hover:scale-105"
        >
          Take Final Assessment Test
        </button>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">🎬 Video Player</h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition transform hover:scale-110"
              >
                ✖
              </button>
            </div>

            {/* Video */}
            <div className="flex-1 overflow-auto p-6">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <YouTube
                  videoId={extractVideoId(selectedVideo) || ''}
                  opts={{
                    width: '100%',
                    playerVars: {
                      autoplay: 1,
                      modestbranding: 1,
                      rel: 0
                    }
                  }}
                  className="w-full h-full"
                />
              </div>
              <div className="mt-6 flex justify-center">
                <a
                  href={selectedVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-all">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 w-full max-w-2xl p-10 rounded-3xl shadow-2xl text-center animate-fadeIn">
            <button
              onClick={closeQuizModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
              ✖
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-md">
              {quizType === 'week' ? `Week ${quizWeek} Quiz` : 'Final Assessment Test'}
            </h2>
            
            {/* Show loading spinner when generating quiz */}
            {isGeneratingQuiz && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4"></div>
                <p className="text-white font-medium">Generating your quiz...</p>
                <p className="text-white opacity-70 text-sm mt-2">This may take a few moments</p>
              </div>
            )}
            
            {/* Show Generate Quiz or Attempt button based on quiz generation status */}
            {!isGeneratingQuiz && (
  quizGenerated && quizId ? (
    <button
    onClick={() => {
      if (quizId) {
        window.open(`/studentWelcome/academic/goals/${goalId}/givequiz/${quizId}`, "_blank");
      }
    }}
    className="inline-block bg-white text-blue-700 font-bold text-lg py-3 px-6 rounded-full hover:bg-gray-100 transition transform hover:scale-105 shadow-md"
  >
    Attempt Quiz
  </button>
  ) : (
    <button
      onClick={generateQuiz}
      className="bg-white text-blue-700 font-bold text-lg py-3 px-6 rounded-full hover:bg-gray-100 transition transform hover:scale-105 shadow-md"
    >
      Generate Quiz
    </button>
  )
)}

            
            {!isGeneratingQuiz && !quizGenerated && (
              <p className="mt-6 text-white opacity-80 text-sm">
                Ready to test your knowledge? 🚀
              </p>
            )}
            
            {!isGeneratingQuiz && quizGenerated && (
              <p className="mt-6 text-white opacity-80 text-sm">
                Your quiz is ready to take! 📝
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalPage;