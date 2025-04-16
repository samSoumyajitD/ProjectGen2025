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

export function BentoGridDemo() {
  return (
    <section className="dark:bg-gray-900">
      <h1 className="text-2xl sm:text-5xl font-bold text-center text-neutral-800 dark:text-neutral-200 pt-[100px] sm:pt-[150px]">
        Discover Smarter Ways to Learn!
      </h1>
      <p className="text-[15px] pr-[20px] pl-[20px] sm:pr-0 sm:pl-0 sm:text-lg text-center text-neutral-600 dark:text-neutral-400 mt-4 mb-12 sm:mb-24">
        Explore AI-powered learning with personalized plans, insights, and success roadmaps!
      </p>

      <BentoGrid className="mx-auto pb-[50px] sm:pb-[200px] px-[50px] sm:px-[50px]">
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
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <img src={imageUrl} alt="feature" className="w-full h-full object-cover rounded-xl grayscale" />
  </div>
);

const items: Item[] = [
  {
    title: "AI-Powered Chatbots",
    description: "Engage with AI peers, mentors, and professors for personalized guidance and support.",
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
    title: "Transition Guides",
    description: "Navigate career transitions with ease using our comprehensive guides.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80" />,
    icon: <IconBook className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Interactive Roadmap Scheduling",
    description: "Plan and schedule your learning journey with interactive timelines.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80" />,
    icon: <IconCalendarEvent className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Progress Analytics",
    description: "Monitor your learning progress with detailed analytics and insights.",
    header: <Skeleton imageUrl="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80" />,
    icon: <IconChartLine className="h-4 w-4 text-neutral-500" />,
  },
];

export default BentoGridDemo;
