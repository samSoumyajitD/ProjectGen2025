"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import { Bot, BookOpen, Target, Map, VideoIcon, MessageSquare, BarChart2, Trophy } from "lucide-react";

const content = [
  {
    title: "Step 1: Level Up Your AI Buddy 🤖",
    description:
      "Time to create your AI bestie! Jump into some fun mini-games that help our AI understand your vibe. No boring forms here - just play, interact, and watch as the AI learns what makes you tick. It's like creating your own digital sidekick that gets smarter the more you hang out!",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <Bot size={48} />
          <p className="text-xl font-semibold">Your AI Bestie</p>
        </div>
      </div>
    ),
  },
  {
    title: "Step 2: Plot Your Main Quest 🎯",
    description:
      "What's your endgame? Whether you're trying to ace those grades, level up your career, or become a coding wizard, we've got you! Pick your path and let our AI be your quest guide. No pressure - just choose what gets you hyped!",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <Target size={48} />
          <p className="text-xl font-semibold">Quest Selection</p>
        </div>
      </div>
    ),
  },
  {
    title: "Step 3: Make It Your Own Aesthetic ✨",
    description:
      "This is where you customize your learning fit! Night owl? Early bird? Visual learner or podcast fan? Set it up your way. Our AI adapts to your rhythm - because who says learning can't match your energy and style?",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <BookOpen size={48} />
          <p className="text-xl font-semibold">Your Learning Aesthetic</p>
        </div>
      </div>
    ),
  },
  {
    title: "Step 4: Your Personal GPS to Success 🗺️",
    description:
      "Unlock your custom roadmap! Our AI drops the perfect mix of courses, challenges, and power-ups designed just for you. It's like having a GPS for your brain - showing you the fastest route to level up your skills!",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <Map size={48} />
          <p className="text-xl font-semibold">Skill GPS</p>
        </div>
      </div>
    ),
  },
  {
    title: "Step 5: Time to Grind! 💪",
    description:
      "Let's get this bread! Dive into epic video content, bag those certs, and crush those weekly challenges. Think of it as XP for your brain - every quiz and assignment levels you up IRL!",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <VideoIcon size={48} />
          <p className="text-xl font-semibold">The Daily Grind</p>
        </div>
      </div>
    ),
  },
  {
    title: "Step 6: Your 24/7 AI Squad 💬",
    description:
      "Stuck on a problem? Our AI chat's got your back! Slide into the DMs anytime for instant help. No judgment, no waiting - just quick answers when you need that clutch support!",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <MessageSquare size={48} />
          <p className="text-xl font-semibold">Your AI Squad</p>
        </div>
      </div>
    ),
  },
  {
    title: "Step 7: Watch Your Stats Pop Off 📈",
    description:
      "Your quiz results are like your personal analytics! Based on how you're crushing it (or where you need a boost), your AI buddy updates your game plan in real-time. It's like having a stats screen for your brain gains!",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <BarChart2 size={48} />
          <p className="text-xl font-semibold">Brain Gains</p>
        </div>
      </div>
    ),
  },
  {
    title: "Step 8: Boss Level Complete! 🏆",
    description:
      "YOU DID IT! Time to flex those certificates and show off your new skills! Plus, your AI's got the inside scoop on what's next in your skill tree. This isn't game over - it's just the beginning of your next epic quest!",
    content: (
      <div className="h-full w-full bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <Trophy size={48} />
          <p className="text-xl font-semibold">Victory Royale</p>
        </div>
      </div>
    ),
  },
];

// Rest of the component remains the same...
export function StickyScrollRevealDemo() {
  return (
    <div className="min-h-screen dar:bg-gray-950  text-white">
      <div className="px-6 py-0 md:px-[150px] md:py-32">
        <div className="max-w-4xl mx-auto mb-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl mb-2 font-bold text-transparent text-center bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white">
  Steps 
</h1>
<p className="text-xl text-gray-400">
  Your AI glow-up starts here, let's go! 
</p>
        </div>
        <StickyScroll content={content} />
      </div>
    </div>
  );
}

export default StickyScrollRevealDemo;