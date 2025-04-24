"use client";
import { withAuth } from "../../../../components/hoc/withAuth";
import { CoverAcRoad } from "@/components/StudentComponents/StudentAcademicRoap";
import FeaturePageNavbar from "@/components/StudentComponents/StudentFeatureNav";
import { useScroll, useTransform, motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useRouter } from "next/navigation";

const ScrollFadeSection = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="flex-1 flex flex-col items-center justify-center min-h-screen gap-6 pb-20"
    >
      <CoverAcRoad content="Roadmap" />
    </motion.div>
  );
};

const Profile = () => {
  const router = useRouter();

  const handleNewGoalClick = () => {
    router.push("/goalGenpage");
  };

  const handleContinueClick = () => {
    router.push("goals");
  };

  return (
    <div className="bg-white dark:bg-black">
      <FeaturePageNavbar />
      <BackgroundLines>
        <ScrollFadeSection />

        <div id="journey">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-transparent text-center bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white mb-8">
            Journey
          </h2>
          <p className="text-base sm:text-lg text-center text-neutral-600 dark:text-neutral-400 mb-12 px-8">
            Your AI-powered path to success—Explore, Learn, and Grow!
          </p>
          <div className="flex justify-center gap-[50px]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewGoalClick}
              className="px-6 py-3 rounded-2xl text-white bg-primary dark:bg-primary-400 transition-all duration-200 shadow-lg"
            >
              New Goal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinueClick}
              className="px-6 py-3 rounded-2xl text-white bg-primary dark:bg-primary-400 transition-all duration-200 shadow-lg"
            >
              Continue
            </motion.button>
          </div>
        </div>
      </BackgroundLines>

      <footer className="w-full py-12 px-4 md:px-12 mt-[300px]">
        <div className="flex flex-col justify-center items-center gap-1">
          <p className="text-sm text-default-400 dark:text-default-500">
            © 2025 SaarthiGenAi. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {/* ...social icons remain unchanged... */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default withAuth(Profile, ["Student", "Working Professional"]);
