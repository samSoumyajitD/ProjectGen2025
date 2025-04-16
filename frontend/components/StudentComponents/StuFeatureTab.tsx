import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconRobot,
  IconMap,
  IconTarget,
  IconSchool,
  IconChartLine,
  IconCalendarEvent,
  IconBook,
} from "@tabler/icons-react";

interface Item {
  title: string;
  description: string;
  header: React.ReactNode;
  icon: React.ReactNode;
}

export function StudentFeatureBentoGridDemo() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-transparent text-center bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white mb-8">
        Features
      </h2>
      <p className="text-base sm:text-lg text-center text-neutral-600 dark:text-neutral-400 mb-12">
        Explore AI-powered learning with personalized plans, insights, and success roadmaps!
      </p>

      <BentoGrid className="mx-auto max-w-7xl">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={`transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${
              i % 2 === 0 ? "animate-floatEven" : "animate-floatOdd"
            } ${i === 3 || i === 6 ? "md:col-span-2" : ""}`}
          />
        ))}
      </BentoGrid>
    </section>
  );
}

interface SkeletonProps {
  imageUrl: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ imageUrl }) => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] sm:min-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <img
      src={imageUrl}
      alt="feature"
      className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-300"
    />
  </div>
);

const items: Item[] = [
  {
    title: "AI-Powered Chatbots",
    description: "Engage with AI peers and professors for personalized guidance and support.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80" />,
    icon: <IconRobot className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Personalized Roadmap Generator",
    description: "Create adaptive roadmaps tailored to your learning goals and career aspirations.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80" />,
    icon: <IconMap className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Goal Setting & Tracking",
    description: "Set, track, and achieve your learning goals with AI-powered tools.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80" />,
    icon: <IconTarget className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "AI-Generated Quizzes",
    description: "Assess your skills and progress with adaptive quizzes powered by AI.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80" />,
    icon: <IconSchool className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Progress Analytics",
    description: "Monitor your learning progress with detailed analytics and insights.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80" />,
    icon: <IconChartLine className="h-4 w-4 text-neutral-500" />,
  },
];

export default StudentFeatureBentoGridDemo;