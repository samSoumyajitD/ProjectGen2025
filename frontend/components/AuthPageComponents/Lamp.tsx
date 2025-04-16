"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import SignUpAuthForm from "./SignUpAuthForm"
import LoginAuthForm from "./LogInAuth"
import { motion, AnimatePresence } from "framer-motion"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { Sparkles,  UserPlus } from "lucide-react"
export const AcmeLogo = () => {
  return (
    <svg fill="none" height="50" viewBox="0 0 32 32" width="50">
      <path
        clipRule="evenodd"
        d="M26.6482 7.0205L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 10.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};
export function BackgroundBeamsWithCollisionDemo() {
  const [activeForm, setActiveForm] = useState("login")
  const searchParams = useSearchParams()

  useEffect(() => {
    const form = searchParams.get('form')
    if (form === 'login' || form === 'signup') {
      setActiveForm(form)
    }
  }, [searchParams])

  return (
    <div className=" h-[150vh] md:h-[90vh] w-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800">
      <BackgroundBeamsWithCollision>
        {/* Hero Section */}
        <div className="relative z-20 text-center  max-w-3xl mx-auto  px-[50px] sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className=" items-center justify-center flex dark:text-white">
            <AcmeLogo />
            </div>
        <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-0 tracking-tight">
  Unlock Your Potential with{" "}
  <span className="inline-block">
    <span className="relative">
      <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-30 animate-pulse"></span>
      <span className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
        Saarthi
      </span>
    </span>
  </span>
</h1>
<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">

  <strong>Access</strong> your adaptive roadmap and level up like never before.
</p>

          </motion.div>
        </div>

        {/* Auth Container */}
        <motion.div
          className=" mr-4 ml-4 "
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-2xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800/50">
            {/* Form Toggle */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8">
              {[
                { type: "login", label: "Sign In", icon: Sparkles},
                { type: "signup", label: "Create Account", icon: UserPlus }
              ].map(({ type, label, icon: Icon }) => (
                <motion.button
                  key={type}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeForm === type
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setActiveForm(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeForm === type && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md shadow-lg"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Form Container */}
            <div className="relative h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeForm}
                  initial={{ opacity: 0, x: activeForm === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeForm === "login" ? 20 : -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {activeForm === "login" ? <LoginAuthForm /> : <SignUpAuthForm />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Text */}
          <motion.div
            className="text-center mt-4 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By continuing, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline decoration-2 underline-offset-2">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline decoration-2 underline-offset-2">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </motion.div>
      </BackgroundBeamsWithCollision>
    </div>
  )
}

export default BackgroundBeamsWithCollisionDemo