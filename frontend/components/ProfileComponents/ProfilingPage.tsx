"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SparklesCore } from "../ui/sparkles";

export function SparklesPreview() {
  const router = useRouter();

  return (
    <div className="h-[40rem] w-full bg-white dark:bg-black flex flex-col items-center justify-center overflow-hidden rounded-md transition-colors duration-300">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-black dark:text-white relative z-20 transition-colors duration-300">
        Profiling
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-400 dark:via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm transition-colors duration-300" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-400 dark:via-indigo-500 to-transparent h-px w-3/4 transition-colors duration-300" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-400 dark:via-sky-500 to-transparent h-[5px] w-1/4 blur-sm transition-colors duration-300" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-400 dark:via-sky-500 to-transparent h-px w-1/4 transition-colors duration-300" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="black dark:white"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)] transition-colors duration-300"></div>
      </div>

      {/* Button with navigation */}
      <button
        onClick={() => router.push("/genzProfile/buildProfile")}
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex text-[18px] p-4   h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-950 font-medium text-slate-950 dark:text-white backdrop-blur-3xl">
          Build Profile
        </span>
      </button>
    </div>
  );
}
