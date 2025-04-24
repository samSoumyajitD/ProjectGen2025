import React, { useState, useEffect } from 'react';
import WeekCard from './WeekCard';
import VideoPlayer from './VideoPlayer';
import { RoadmapData } from './types';
import { Bookmark, ChevronDown, Zap } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface RoadmapViewerProps {
  goalId?: string;
}

const RoadmapViewer: React.FC<RoadmapViewerProps> = ({ goalId = '1' }) => {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [activeWeek, setActiveWeek] = useState<number | null>(1);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const userCookie = Cookies.get('user');
        if (!userCookie) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userCookie);
        const userId = user.id;

        const res = await axios.get(`http://127.0.0.1:5000/get-roadmap/${userId}/${goalId}`, {
          withCredentials: true,
        });

        if (res.data.roadmap) {
          setRoadmapData({
            title: "DSA with C++ Learning Path",
            weeks: res.data.roadmap
          });
        } else {
          setError('No roadmap data found');
        }
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching roadmap:', err);
        setError(err.response?.data?.error || 'Failed to load roadmap');
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [goalId]);

  const handleVideoSelect = (url: string) => {
    setVideoUrl(url);
    setIsVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoOpen(false);
  };

  const toggleWeek = (weekNumber: number) => {
    setActiveWeek(activeWeek === weekNumber ? null : weekNumber);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your learning roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Roadmap</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">No Roadmap Found</h2>
          <p className="text-gray-600">The requested roadmap could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-3">{roadmapData.title}</h1>
                <p className="text-blue-100">{roadmapData.weeks.length} weeks to mastery</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Zap className="w-6 h-6 text-yellow-300" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-100">Supercharge your learning with this structured roadmap</p>
                      <div className="w-full h-2 bg-blue-200 bg-opacity-30 rounded-full mt-2">
                        <div className="bg-yellow-300 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <div className="flex items-center mb-4">
            <Bookmark className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Your Learning Journey</h2>
          </div>
          
          <div className="relative overflow-x-auto pb-2">
            <div className="flex space-x-2 md:space-x-4">
              {roadmapData.weeks.map((week) => (
                <button
                  key={week.week}
                  onClick={() => setActiveWeek(week.week)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeWeek === week.week
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week {week.week}
                </button>
              ))}
            </div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="space-y-4">
          {roadmapData.weeks.map((weekData) => (
            <WeekCard
              key={weekData.week}
              data={weekData}
              isActive={activeWeek === weekData.week}
              onVideoSelect={handleVideoSelect}
              onToggle={() => toggleWeek(weekData.week)}
            />
          ))}
        </div>
      </div>

      <VideoPlayer
        videoUrl={videoUrl}
        isOpen={isVideoOpen}
        onClose={handleCloseVideo}
      />
    </div>
  );
};

export default RoadmapViewer;