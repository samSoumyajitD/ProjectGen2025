"use client";
import { ContainerScroll } from "../ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden  pt-6">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white  mb-0 md:mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Demo
              </span>
            </h1>
          </>
        }
      >
        <div className="w-full aspect-video relative group">
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl group-hover:bg-opacity-20 transition-all duration-300"></div>
          <iframe
            src="https://www.youtube.com/embed/LdMYsbDkJns"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300"
          ></iframe>
        </div>
      </ContainerScroll>
    </div>
  );
}