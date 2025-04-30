import { ThreeDCardDemo } from "../CommonComponents/FeatureCard";

export default function StudentFeatureCardSection() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-transparent text-center bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white mb-8">
        Your Journey
      </h2>
      <p className="text-base sm:text-lg text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
        Explore AI-powered learning whether it's your academic or professional journey!
      </p>

      <div className="flex justify-center gap-0 md:gap-20 flex-wrap">
      
       
        <ThreeDCardDemo
  CardItemOne="Ace Your Academics"
  CardItemTwo="Transform your study game with AI-powered learning tools and personalized study paths"
  ImageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      
 ExploreHrefLink="/studentWelcome/academic"
 ButtonName= "Academic Growth"
/>

      </div>
    </div>
  );
}