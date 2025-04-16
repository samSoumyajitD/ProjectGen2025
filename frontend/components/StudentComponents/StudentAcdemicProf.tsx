import React from "react";
import { Cover } from "../../components/ui/cover";

// Define the props interface
interface CoverDemoProps {
  content: string; // Assuming `content` is a string
}

export function CoverAcProf({ content }: CoverDemoProps) {
  return (
    <div>
     <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
  Your <Cover>{content}</Cover>
</h1>

    </div>
  );
}