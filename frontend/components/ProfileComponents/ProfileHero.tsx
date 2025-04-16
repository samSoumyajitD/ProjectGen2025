"use client";
import React from "react";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "../ui/text-reveal-card";

export function TextRevealCardPreview() {
  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-[#0E0E10] min-h-screen w-full px-4 sm:px-6 lg:px-8">
      <TextRevealCard
        text="You know the goal"
        revealText="We know the path"
      >
        <TextRevealCardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription className="text-sm sm:text-base md:text-lg lg:text-xl">
        Hover over the card to reveal the hidden
          secret.
        </TextRevealCardDescription>
      </TextRevealCard>

      <div className="flex flex-col items-center justify-center mt-10 sm:mt-16">
        <div className="w-8 h-16 sm:w-10 sm:h-20 md:w-12 md:h-24 border-2 border-gray-500/90 rounded-2xl flex">
          <span className="block w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-gray-500/90 to-gray-400 rounded-full m-auto animate-scroll" />
        </div>
        <div className="font-semibold text-neutral-300 dark:text-neutral-700 p-2 text-sm sm:text-base md:text-[14px]">
          Scroll Down
        </div>
      </div>
    </div>
  );
}