import React from "react";
import GoogleGeminiEffectDemo from "../components/HomePageComponents/GeminiEffect";
import HeroPageNavbar from "../components/HomePageComponents/HeroPageNavbar";
import  FAQ  from "../components/HomePageComponents/FAQ"
import { HeroParallaxDemo } from "../components/HomePageComponents/HeroParallax";
import { BentoGridDemo } from "../components/HomePageComponents/FeatureCard";
import { StickyScrollRevealDemoII } from "../components/HomePageComponents/StepstoGo"
import Footer from "../components/HomePageComponents/Footer";

import {HeroScrollDemo} from "../components/HomePageComponents/Demo"
export default function Home() {

  return (
    <div >
      <GoogleGeminiEffectDemo />
      <HeroPageNavbar />
      <div id='home' >
      <HeroParallaxDemo />
      </div>
      <div className=" dark:bg-gradient-to-b bg-white dark:bg-gray-900 " id="demo" >
     
      <HeroScrollDemo/>
     </div>
     <div id="features">      <BentoGridDemo />
     </div>
<div id="steps">    <StickyScrollRevealDemoII/>
</div>
<div id="faq">
      <FAQ />
      </div>
      <Footer />
    </div>
  );
}