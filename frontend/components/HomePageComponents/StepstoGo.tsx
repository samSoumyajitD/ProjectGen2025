"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import { Bot, BookOpen, Target, Map, VideoIcon, MessageSquare, BarChart2, Trophy, UserCheck } from "lucide-react";

const content = [
    {
      title: "Step 1: Pick Your Type 🎮",
      description:
        "Student or working pro - what's your current vibe? Whether you're grinding through academics, landing that first job, leveling up your career, or ready for a whole new skill tree, we've got your back! Select your path and let's customize this journey for your specific quest.",
      content: (
        <div className="h-full w-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-4">
            <UserCheck size={48} />
            <p className="text-xl font-semibold">Choose Your Character</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Create Your Digital Twin 🤖",
      description:
        "Time to build your AI bestie! Play through some fun mini-games that help our AI get your vibe. It's like creating your personal TikTok For You Page, but for learning! The more you interact, the better it understands your unique learning style.",
      content: (
        <div className="h-full w-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-4">
            <Bot size={48} />
            <p className="text-xl font-semibold">AI Bestie Setup</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Choose Your Main Quest 🎯",
      description:
        "What's the move? Whether you're trying to speedrun your degree, secure that bag with a dream job, or become the main character in your field - we've got the blueprint! Your AI guide helps you plan the perfect route to your goals.",
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
      title: "Step 4: Set Your Learning Aesthetic ✨",
      description:
        "No cap - learning hits different when it matches your style! Morning person or night owl? Videos or podcasts? Quick sprints or deep dives? Set up your learning feed exactly how you want it. It's giving personalized education fr fr!",
      content: (
        <div className="h-full w-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-4">
            <BookOpen size={48} />
            <p className="text-xl font-semibold">Vibe Check</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 5: Unlock Your Skill Tree 🗺️",
      description:
        "Your AI drops a custom roadmap that's bussin'! Get a perfect mix of courses, certifications, and side quests that level up your skills. It's like having a cheat code for your career - but totally legit!",
      content: (
        <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-4">
            <Map size={48} />
            <p className="text-xl font-semibold">Power-Up Path</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 6: Start The Grind 💪",
      description:
        "Time to level up IRL! Dive into fire content, bag those certificates, and crush those weekly challenges. Think of it as building your personal highlight reel - every W counts towards your final evolution!",
      content: (
        <div className="h-full w-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-4">
            <VideoIcon size={48} />
            <p className="text-xl font-semibold">XP Grind</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 7: Get That AI Backup 💬",
      description:
        "Stuck on a problem? Your AI squad's got you 24/7! Slide into the DMs whenever you need a boost. It's like having a group chat that always responds with the clutch answers - no ghosting ever!",
      content: (
        <div className="h-full w-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-4">
            <MessageSquare size={48} />
            <p className="text-xl font-semibold">AI Squad</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 8: Track Those Gains 📈",
      description:
        "Watch your stats go crazy! Your progress analytics are like your personal TikTok analytics, but for your brain gains. The AI keeps tweaking your journey based on your Ws and Ls - making sure you're always trending up!",
      content: (
        <div className="h-full w-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white p-8">
          <div className="flex flex-col items-center gap-4">
            <BarChart2 size={48} />
            <p className="text-xl font-semibold">Progress Check</p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 9: Secure The Dub 🏆",
      description:
        "SHEEEESH - YOU DID THAT! Time to flex those certificates and new skills on LinkedIn! Plus, your AI's already cooking up the next moves for your skill tree. This isn't the end - it's just your origin story!",
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

export function StickyScrollRevealDemoII() {
  return (
    <div className="min-h-screen dark:bg-gray-900 text-white">
      <div className="px-6 py-0 md:px-[150px] md:pb-32">
        <div className="max-w-4xl mx-auto mb-0 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white  mb-0 md:mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Steps
              </span>
            </h1>
        </div>
        <StickyScroll content={content} />
      </div>
    </div>
  );
}

export default StickyScrollRevealDemoII;