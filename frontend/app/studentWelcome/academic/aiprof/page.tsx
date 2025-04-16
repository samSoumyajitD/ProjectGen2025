"use client";
import React, { useState } from "react";
import {CoverAcProf} from "../../../../components/StudentComponents/StudentAcdemicProf";
import StuNavBar from "../../../../components/CommonComponents/WelcomePageNav";

import CustomChatbot from "../../../../components/Chatbot/Chatbot";

import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const AcademicPage: React.FC = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="bg-gradient-to-b from-white to-white dark:from-black dark:to-gray-900 min-h-screen flex flex-col">
      <StuNavBar />
      <div className="mt-[50px] flex-grow">
        <CoverAcProf content="Professor" />

        {/* AI-Powered Learning Assistance */}
        <div className="container mx-auto p-6 text-center">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
            Your AI Professor for Academic Growth
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant academic support through our AI-powered chatbot.
          </p>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-50">
        {!opened && (
          <button
            className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
            onClick={() => setOpened(true)}
          >
            <IoChatbubbleEllipsesOutline size={30} />
          </button>
        )}
      </div>

      {/* Chatbot Component */}
      {opened && (
        <div className="fixed bottom-16 right-5 w-80 h-[500px] bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <CustomChatbot opened={opened} setOpened={setOpened} headerTitle="AI Professor" initialMessage="Welcome! I'm your AI Professor, here to guide you through your learning journey. What can I help you with today?" />
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setOpened(false)}
          >
            ✖
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className=" py-4 mt-auto">
        <div className="container mx-auto max-w-7xl px-12 text-center">
          <p className="text-sm text-default-400 dark:text-default-500">
            © 2025 SaarthiGenAi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AcademicPage;