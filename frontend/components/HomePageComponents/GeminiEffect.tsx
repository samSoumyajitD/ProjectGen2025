"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React from "react";
import { GoogleGeminiEffect } from "../ui/google-gemini-effect";
import { useTheme } from "../../context/ThemeProvider"; // Import your custom ThemeProvider

function GoogleGeminiEffectDemo() {
  const ref = React.useRef(null);
  const { darkMode, toggleDarkMode } = useTheme(); // Use darkMode and toggleDarkMode from your context

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  // Theme-based styles
  const backgroundStyle = {
    dark: {
      backgroundColor: "#000000",
      backgroundImage: `
        radial-gradient(circle at 75% 25%, rgba(100, 100, 255, 0.2), transparent 50%),
        radial-gradient(circle at 25% 75%, rgba(150, 100, 255, 0.2), transparent 50%)
      `,
      particles: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
    },
    light: {
      backgroundColor: "#ffffff",
      backgroundImage: `
        radial-gradient(circle at 75% 25%, rgba(100, 100, 255, 0.1), transparent 50%),
        radial-gradient(circle at 25% 75%, rgba(150, 100, 255, 0.1), transparent 50%)
      `,
      particles: "radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
    },
  };

  const currentBackground = darkMode ? backgroundStyle.dark : backgroundStyle.light;

  return (
    <div
      className={`h-[100vh] md:sm:h-[400vh] sm:h-[400vh] w-full relative overflow-clip transition-colors pt-40 ${
        darkMode ? "text-white" : "text-black"
      }`}
      ref={ref}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: currentBackground.backgroundColor,
          backgroundImage: currentBackground.backgroundImage,
        }}
        animate={{
          backgroundImage: `
            radial-gradient(circle at 75% 25%, rgba(100, 100, 255, ${darkMode ? "0.3" : "0.2"}), transparent 50%),
            radial-gradient(circle at 25% 75%, rgba(150, 100, 255, ${darkMode ? "0.3" : "0.2"}), transparent 50%)
          `,
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      {/* Glowing Particles */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: currentBackground.particles,
          backgroundSize: "20px 20px",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Google Gemini Effect */}
      <GoogleGeminiEffect 
     pathLengths={[
        pathLengthFirst,
        pathLengthSecond,
        pathLengthThird,
        pathLengthFourth,
        pathLengthFifth,
      ]}
      />
    </div>
  );
}

export default GoogleGeminiEffectDemo;
