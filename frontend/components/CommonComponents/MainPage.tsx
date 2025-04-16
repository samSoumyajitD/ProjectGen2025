"use client"; // ✅ Add this at the top

import React from "react";
import { useRouter } from "next/navigation"; // ✅ Use 'next/navigation' instead of 'next/router'
import { BackgroundLines } from "@/components/ui/background-lines";
import { Rocket } from "lucide-react";
import { Tooltip } from "@heroui/react";
import Cookies from "js-cookie"; // ✅ Import js-cookie to handle cookies

export function MainPageWelcome() {
  const router = useRouter(); // ✅ No error now

  // Function to handle navigation based on role
  const handleGetStarted = () => {
    const userRole = Cookies.get("role"); // ✅ Get the role from cookies

    if (userRole === "Student") {
      router.push("/studentWelcome"); // ✅ Redirect to student page
    } else if (userRole === "Working Professional") {
      router.push("/workingProfessionalWelcome"); // ✅ Redirect to working professional page
    } else {
      // Handle cases where the role is not set or invalid
      console.error("Invalid or missing role in cookies");
      // Optionally, redirect to a default page or show an error message
      router.push("/defaultPage"); // Replace with your default page
    }
  };

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-6 text-center">
      <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans py-4 sm:py-6 md:py-10 font-bold tracking-wider">
        Ready to Level Up? <br /> SarthiGenAI Awaits!
      </h2>
      <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-400">
        Your AI-Powered Growth Engine is primed 
      </p>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-6">
        <Tooltip
          key="secondary"
          className="capitalize"
          color="secondary"
          content={
            <div className="px-4 py-1.5 rounded-lg">
              <div className="text-sm font-semibold text-neutral-100 dark:text-white">
                Continue Your Journey
              </div>
              <div className="text-xs text-neutral-300 dark:text-neutral-100">
                Keep leveling up—no limits, just straight growth.
              </div>
            </div>
          }
          placement="bottom"
          offset={-4}
        >
          <button
            onClick={handleGetStarted} // ✅ Call handleGetStarted on button click
            className="relative px-6 sm:px-8 py-2 flex items-center gap-2 text-base sm:text-lg font-medium text-indigo-500 dark:text-white rounded-lg border-2 border-indigo-500 dark:border-white transition-all duration-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-105 shadow-lg"
          >
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6" /> Continue Journey
          </button>
        </Tooltip>
      </div>
    </BackgroundLines>
  );
}