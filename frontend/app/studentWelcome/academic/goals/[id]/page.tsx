'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import YouTube from 'react-youtube';

const GoalPage = () => {
  const params = useParams();
  const goalId = params.id as string;

  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

        // Filter out empty weeks and sort by week number
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Your Learning Roadmap
      </h1>
      
      {roadmap.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>No roadmap data available for this goal.</p>
        </div>
      )}

      <div className="space-y-8">
        {roadmap.map((weekData) => (
          <div key={weekData.week} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-800 px-4 py-3">
              <h2 className="text-xl font-semibold text-white">Week {weekData.week}</h2>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Goals</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {weekData.goals?.map((goal: string, index: number) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {weekData.topics?.map((topic: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Recommended Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weekData.suggested_yt_videos?.map((video: string, index: number) => {
                    const videoId = extractVideoId(video);
                    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => openVideoModal(video)}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg overflow-hidden transition-colors"
                      >
                        <div className="flex">
                          {thumbnailUrl && (
                            <div className="w-1/3 flex-shrink-0">
                              <img 
                                src={thumbnailUrl} 
                                alt="Video thumbnail" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-3 w-2/3">
                            <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                              {video}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Video Player</h3>
              <button 
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-w-16 aspect-h-9">
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
                  className="w-full"
                />
              </div>
              <div className="mt-4">
                <a 
                  href={selectedVideo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalPage;