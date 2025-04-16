"use client";

import Image from "next/image";
import { Tabs } from "../ui/tabs";

export function TabsDemo() {
  const tabs = [
    
    {
      title: "Roadmaps",
      value: "roadmap",
      content: (
        <TabContent
          title="Personalized Roadmap Generator"
          description="Create adaptive roadmaps tailored to your learning goals and career aspirations."
          imageUrl="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80"
        />
      ),
    },
    {
      title: "Goals",
      value: "goal-tracking",
      content: (
        <TabContent
          title="Goal Setting & Tracking"
          description="Set, track, and achieve your learning goals with AI-powered tools."
          imageUrl="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80"
        />
      ),
    },
    {
        title: "Chatbots",
        value: "chatbots",
        content: (
          <TabContent
            title="AI-Powered Chatbots"
            description="Engage with AI peers, mentors, and professors for personalized guidance and support."
            imageUrl="https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80"
          />
        ),
      },
    {
      title: "Quizzes",
      value: "quizzes",
      content: (
        <TabContent
          title="AI-Generated Quizzes"
          description="Assess your skills and progress with adaptive quizzes powered by AI."
          imageUrl="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80"
        />
      ),
    },
   
    {
      title: "Progress",
      value: "progress-analytics",
      content: (
        <TabContent
          title="Progress Analytics"
          description="Monitor your learning progress with detailed analytics and insights."
          imageUrl="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80"
        />
      ),
    },
  ];

  return (
    <section className="min-h-screen bg-white dark:bg-black pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl lg:text-7xl mb-12 sm:mb-16 font-bold text-transparent text-center bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white">
          Features
        </h2>
        <div className="h-[30rem] sm:h-[35rem] lg:h-[45rem] [perspective:1000px] relative">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </section>
  );
}

const TabContent = ({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) => {
  return (
    <div className="w-full h-full overflow-hidden relative rounded-2xl p-6 sm:p-8 lg:p-10 text-white bg-gradient-to-br from-purple-700 to-violet-900">
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4 sm:px-0">
          {title}
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl px-4 sm:px-0">
          {description}
        </p>
        <div className="relative flex-1 w-full mt-auto">
          <Image
            src={imageUrl}
            alt={title}
            width={1200}
            height={800}
            className="object-cover rounded-xl w-full h-full filter grayscale hover:grayscale-0 transition-all duration-300"
            priority
          />
        </div>
      </div>
    </div>
  );
};
