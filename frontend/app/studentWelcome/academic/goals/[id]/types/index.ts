export interface Topic {
    name: string;
  }
  
  export interface WeekData {
    week: number;
    goals: string[];
    topics: string[];
    suggested_yt_videos: string[];
  }
  
  export interface RoadmapData {
    title: string;
    weeks: WeekData[];
  }