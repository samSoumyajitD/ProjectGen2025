import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import { WeekData } from "./types";

interface WeekCardProps {
  data: WeekData;
  isActive: boolean;
  onVideoSelect: (url: string) => void;
  onToggle: () => void;
}

const WeekCard: React.FC<WeekCardProps> = ({ data, isActive, onVideoSelect, onToggle }) => {
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const toggleGoalCompletion = (goal: string) => {
    if (completedGoals.includes(goal)) {
      setCompletedGoals(completedGoals.filter(g => g !== goal));
    } else {
      setCompletedGoals([...completedGoals, goal]);
    }
  };

  const toggleTopicCompletion = (topic: string) => {
    if (completedTopics.includes(topic)) {
      setCompletedTopics(completedTopics.filter(t => t !== topic));
    } else {
      setCompletedTopics([...completedTopics, topic]);
    }
  };

  // Calculate completion percentage
  const totalItems = data.goals.length + data.topics.length;
  const completedItems = completedGoals.length + completedTopics.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className={`mb-6 rounded-lg overflow-hidden shadow-md transition-all duration-300 ${isActive ? 'shadow-lg border-l-4 border-blue-600' : 'border border-gray-200'}`}>
      <div
        onClick={onToggle}
        className={`flex items-center justify-between px-6 py-5 cursor-pointer transition-colors ${
          isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-50' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            completionPercentage === 100 
              ? 'bg-green-500 text-white' 
              : completionPercentage > 0 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
          }`}>
            {data.week}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Week {data.week}</h3>
            <div className="flex items-center mt-1">
              <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    completionPercentage === 100 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{completionPercentage}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {isActive ? (
            <ChevronUp className="w-6 h-6 text-blue-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </div>

      {isActive && (
        <div className="bg-white p-6 transition-all duration-500 ease-in-out">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20v-4a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v4"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                Weekly Goals
              </h4>
              <ul className="space-y-2">
                {data.goals.map((goal, index) => (
                  <li 
                    key={index} 
                    className="flex items-start"
                    onClick={() => toggleGoalCompletion(goal)}
                  >
                    <div className="mt-0.5 cursor-pointer">
                      <CheckCircle 
                        className={`w-5 h-5 ${
                          completedGoals.includes(goal) 
                            ? 'text-green-500 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </div>
                    <span className={`ml-2 ${
                      completedGoals.includes(goal) 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-700'
                    }`}>
                      {goal}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><path d="M14 4v4"></path><path d="M10 4v4"></path><path d="M3 10h18"></path></svg>
                </span>
                Topics to Cover
              </h4>
              <ul className="space-y-2">
                {data.topics.map((topic, index) => (
                  <li 
                    key={index} 
                    className="flex items-start"
                    onClick={() => toggleTopicCompletion(topic)}
                  >
                    <div className="mt-0.5 cursor-pointer">
                      <CheckCircle 
                        className={`w-5 h-5 ${
                          completedTopics.includes(topic) 
                            ? 'text-green-500 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </div>
                    <span className={`ml-2 ${
                      completedTopics.includes(topic) 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-700'
                    }`}>
                      {topic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </span>
                Recommended Videos
              </h4>
              <ul className="space-y-3">
                {data.suggested_yt_videos.map((videoUrl, index) => {
                  // Extract video ID to get thumbnail
                  const videoId = videoUrl.split('v=')[1]?.split('&')[0] || 
                                  videoUrl.split('youtu.be/')[1] || '';
                  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                  
                  return (
                    <li key={index} className="group">
                      <div 
                        className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
                        onClick={() => onVideoSelect(videoUrl)}
                      >
                        <div className="relative">
                          <img 
                            src={thumbnailUrl} 
                            alt="Video thumbnail" 
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-sm text-gray-700 truncate">
                            Video {index + 1}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekCard;