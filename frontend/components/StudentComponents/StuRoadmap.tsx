"use client";
import React from "react";
import { PinContainer } from "../ui/3d-pin";

// Define the props interface
interface AnimatedPinDemoProps {
  title: string;
  href: string;
  h3: string;
  subhead: string;
  bg_css?: string; // Optional prop with a default value
}

export function AnimatedPinDemo({ title, href, h3, subhead, bg_css = "bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" }: AnimatedPinDemoProps) {
  return (
    <div className="h-[25rem] w-full flex items-center justify-center ">
      <PinContainer title={title} href={href}>
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            {h3}
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">{subhead}</span>
          </div>
          <div className={`flex flex-1 w-full rounded-lg mt-4 ${bg_css}`} />
        </div>
      </PinContainer>
    </div>
  );
}