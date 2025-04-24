"use client";
import {
  Avatar
} from "@heroui/react";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../ui/sidebar";
import {
  IconArrowLeft,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils/cn";
import TextInput from "./input/TextInput";
import MCQInput from "./input/MCQInput";
import MultiSelectMCQ from "./input/MultiSelectMCQ";
import ParagraphInput from "./input/ParagraphInput";
import DynamicInput from "./input/DynamicInput";
import ProgressBar from "./ProgressBar";
import { useTheme } from "../../../context/ThemeProvider";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { useRouter } from "next/navigation"; // Import useRouter for redirection

const questions = [
    {
      type: "text",
      question: "What is your learning goal?",
      key: "goal",
      required: true,
    },
    {
      type: "mcq",
      question: "How much time can you dedicate to learning per week?",
      key: "time_per_week",
      options: ["<5 hrs", "5-10 hrs", "10-20 hrs", "20+ hrs"],
      required: true,
    },
    {
      type: "mcq",
      question: "What is your preferred learning mode?",
      key: "learning_mode",
      options: ["Self-paced", "Instructor-led", "Group learning", "Hybrid"],
      required: true,
    },
    {
      type: "mcq",
      question: "What is your current skill level in this area?",
      key: "skill_level",
      options: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    {
      type: "text",
      question: "Do you have a specific deadline for achieving your goal? (in months)",
      key: "deadline",
      required: true,
    },
  ];
import { Moon, Sun, Home } from "lucide-react"; // Icons

export default function GoalQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null); // State to store user profile data
  const { darkMode, toggleDarkMode } = useTheme(); // State to manage theme
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter(); // Initialize useRouter

  // Fetch user profile data
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setUserId(user.id); // Set the user ID from the cookie
      setFormData((prev) => ({ ...prev, userId: user.id })); // Add userId to formData
    }
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }
  
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await axios.post(
          `http://localhost:5000/api/goals/createOrUpdate`,
          { ...formData, userId }, // Include userId in the request body
          { withCredentials: true }
        );

const roadmapresponse = await axios.post(
  `http://127.0.0.1:5000/generate-roadmap/${userId}/${response.data.goal._id}`,
  { userId, goalId: response.data.goal._id }, // Include userId and goalId in the request body
  { withCredentials: true },


)

        alert("Goal set successfully!");

  
        // Redirect based on user role
        const userRole = Cookies.get("role");
        if (userRole === "Student") {
          router.push("/studentWelcome/academic/goals");
        } else if (userRole === "Working Professional") {
          router.push("/workingProWelcome");
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error setting goal');
        console.log(error);
        alert(error.response?.data?.message || 'Error setting goal');

      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentStep];
    switch (question.type) {
      case "text":
        return <TextInput question={question.question} value={formData[question.key] || ""} onChange={(value) => handleInputChange(question.key, value)} />;
      case "mcq":
        return <MCQInput question={question.question} options={question.options} value={formData[question.key] || ""} onChange={(value) => handleInputChange(question.key, value)} />;
      case "multiSelect":
        return <MultiSelectMCQ question={question.question} options={question.options} value={formData[question.key] || []} onChange={(value) => handleInputChange(question.key, value)} />;
      case "paragraph":
        return <ParagraphInput question={question.question} value={formData[question.key] || ""} onChange={(value) => handleInputChange(question.key, value)} />;
      case "dynamic":
        return <DynamicInput question={question.question} value={formData[question.key] || []} onChange={(value) => handleInputChange(question.key, value)} />;
      default:
        return null;
    }
  };

  const links = [
    {
      label: "Home",
      href: "/welcome",
      icon: (
        <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className={cn(
        "rounded-lg flex flex-col md:flex-row bg-gray-50 dark:bg-neutral-900 w-full flex-1 max-w-7xl mx-auto border border-neutral-300 dark:border-neutral-700 shadow-lg",
        "h-[100vh] overflow-hidden"
      )}>
        <Sidebar open={open} setOpen={setOpen} className="bg-white dark:bg-neutral-800 shadow-md">
          <SidebarBody className="justify-between gap-6">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-6 flex flex-col gap-3">
                {questions.map((question, idx) => (
                  <SidebarLink
                    key={idx}
                    link={{
                      label: question.question,
                      href: "#",
                      icon: <div className="h-5 w-5 flex-shrink-0" />,
                    }}
                    onClick={() => setCurrentStep(idx)}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all text-sm font-medium",
                      currentStep === idx 
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                    )}
                  />
                ))}
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
                <SidebarLink
                  link={{
                    label: darkMode ? "Light Mode" : "Dark Mode",
                    href: "#",
                    icon: darkMode ? (
                      <Sun className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Moon className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                    ),
                  }}
                  onClick={toggleDarkMode}
                  className="hover:bg-gray-200 dark:hover:bg-neutral-700 p-2 rounded-lg"
                />
              </div>
            </div>
            <div className="p-4 border-t dark:border-neutral-600">
              <SidebarLink
                link={{
                  label: user ? user.name : "User",
                  href: "#",
                  icon: (
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform text-[20px] font-[500]"
                      color="primary"
                      name={user ? user.name[0] : "U"} 
                      size="sm"
                    />
                  ),
                }}
                className="hover:bg-gray-200 dark:hover:bg-neutral-700 p-2 rounded-lg"
              />
            </div>
          </SidebarBody>
        </Sidebar>
      
        <div className="flex flex-1 flex-col">
          <h1 className="text-3xl font-bold text-center m-6 text-neutral-800 dark:text-neutral-100">
            Saarthi AI Interactive Goal setting
          </h1>

          <div className="p-4 md:p-8 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full shadow-md">
            <ProgressBar current={currentStep + 1} total={questions.length} className="mb-4" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-gray-100 mt-[50px] h-[300px] dark:bg-neutral-800 rounded-lg shadow-md"
              >
                {renderQuestion()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-between">
              <motion.button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-300 text-gray-700 dark:text-white rounded-lg disabled:opacity-50 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
              <motion.button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 dark:text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentStep === questions.length - 1 ? "Build" : "Next"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20">
      <LogoIcon />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[20px] text-black font-[600] dark:text-white whitespace-pre">
        SaarthiGenAI
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M26.6482 7.0205L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 10.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};