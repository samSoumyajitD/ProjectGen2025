"use client"

import type React from "react"
import { useState, useEffect } from "react"
import FirstPage from "../../../components/ProfileBuiltComponents/1stpage"
import SecondPage from "../../../components/ProfileBuiltComponents/2ndpage"
import ThirdPage from "../../../components/ProfileBuiltComponents/3rdpage"
import FourthPage from "../../../components/ProfileBuiltComponents/4thpage"
import axios from "axios"
import { parseCookies } from "nookies"
import FifthPage from "../../../components/ProfileBuiltComponents/5thpage"
import ProgressBar from "../../../components/ProfileBuiltComponents/ProgessBar"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation" // Added for programmatic navigation
import { CheckCircle, AlertCircle } from "lucide-react";
interface UserData {
  organization: string;
  currentPosition: string;
  fieldOfStudy: string;
  aboutYourself: string;
  takeNotes: string;
  learningType: string;
  expertiseLevel: string;
  prefersGroupLearning: string;
  avatar: string;
  preferredLearningTime: string;
  areasOfInterest: string[];
  preferredResources: string[];
  priorities: string[];
  schedule?: {
    weekday?: { work: string; development: string; personal: string };
    weekend?: { development: string; personal: string };
  };
  learningFlow?: { nodes: any[]; edges: any[] };
}

const MainPage: React.FC = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (currentStep === 5) {
      loadUserData()
    }
  }, [currentStep])

  const loadUserData = () => {
    try {
      const personalInfo = JSON.parse(localStorage.getItem("personalInfo") || "{}")
      const learningPrefs = JSON.parse(localStorage.getItem("learningPrefs") || "{}")
      const profileInfo = JSON.parse(localStorage.getItem("profileInfo") || "{}")
      const interests = JSON.parse(localStorage.getItem("interests") || "{}")
      const priorities = JSON.parse(localStorage.getItem("priorities") || "[]")
      const schedule = JSON.parse(localStorage.getItem("schedule") || "{}")
      const learningFlow = JSON.parse(localStorage.getItem("learningFlow") || '{"nodes": [], "edges": []}')

      const prioritiesText = priorities.map((priority: { text: string }) => priority.text)

      const data: UserData = {
        organization: personalInfo?.organization || "Not specified",
        currentPosition: personalInfo?.currentPosition || "Not specified",
        fieldOfStudy: personalInfo?.fieldOfStudy || "Not specified",
        aboutYourself: personalInfo?.aboutYourself || "Not specified",
        takeNotes: learningPrefs?.takeNotes || "Not specified",
        learningType: learningPrefs?.learningType || "Not specified",
        expertiseLevel: learningPrefs?.expertiseLevel || "Not specified",
        prefersGroupLearning: learningPrefs?.prefersGroupLearning ? "Yes" : "No",
        avatar: profileInfo?.avatar || "Not specified",
        preferredLearningTime: profileInfo?.preferredLearningTime || "Not specified",
        areasOfInterest: Array.isArray(interests?.areasOfInterest) ? interests.areasOfInterest : [],
        preferredResources: Array.isArray(interests?.preferredResources) ? interests.preferredResources : [],
        priorities: prioritiesText,
        schedule: schedule,
        learningFlow: learningFlow,
      }

      setUserData(data)
    } catch (err) {
      console.error("Error parsing localStorage data", err)
      setError("Error loading user data")
    }
  }

  const handleSubmit = async () => {
    if (!userData) {
      setError("No user data available")
      return
    }
  
    setIsSubmitting(true)
    setError(null)
  
    try {
      const cookies = parseCookies()
      const user = cookies.user ? JSON.parse(cookies.user) : null
      const userId = user?.id
  
      if (!userId) {
        throw new Error("User ID not found. Please log in again.")
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/admin/profile/${userId}`,
        userData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
  
      if (response.status !== 200) {
        throw new Error("Failed to update profile.")
      }
  
      setShowSuccess(true)
      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        router.push("/mainPage")
      }, 2000)
  
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update profile.")
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FirstPage />
      case 2:
        return <SecondPage />
      case 3:
        return <ThirdPage />
      case 4:
        return <FourthPage />
      case 5:
        return <FifthPage data={userData} />
      default:
        return null
    }
  }

  const handleNext = () => {
    if (currentStep === totalSteps) {
      handleSubmit()
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-2 lg:px-8 py-8">
{showSuccess && (
   <motion.div
   initial={{ opacity: 0, y: -5, scale: 0.98 }}
   animate={{ opacity: 1, y: 0, scale: 1 }}
   exit={{ opacity: 0, y: -5, scale: 0.98 }}
   transition={{ duration: 0.3, ease: "easeOut" }}
   className="fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 flex items-center space-x-2"
   style={{
     boxShadow: "0px 4px 20px rgba(0, 255, 128, 0.15)", // Soft green glow
     backdropFilter: "blur(10px)",
   }}
 >
   <CheckCircle className="h-5 w-5 text-green-500" />
   <span className="font-medium text-sm text-gray-900">All set! You're golden!</span>
 </motion.div>
)}


      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8">Profile Creation</h1>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {error && (
  <motion.div
  initial={{ opacity: 0, y: -10, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.95 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="fixed top-5 left-1/2 -translate-x-1/2 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-lg bg-white/30 border border-red-300/40 flex items-center space-x-2"
  style={{
    boxShadow: "0px 4px 20px rgba(255, 0, 0, 0.15)",
    backdropFilter: "blur(12px)",
  }}
>
  <AlertCircle className="h-5 w-5 text-red-500" />
  <span className="text-sm font-medium text-red-600">{error || "Oops! Something went wrong."}</span>
</motion.div>
)}

      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white p-2 sm:p-2 rounded-2xl shadow-xl mt-6 sm:mt-8"
      >
        {renderStep()}
      </motion.div>
      <div className="mt-8 sm:mt-10 flex w-full max-w-2xl justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-full text-gray-900 bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition disabled:opacity-50"
        >
          {currentStep === totalSteps ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
        </button>
      </div>
    </div>
  )
}

export default MainPage