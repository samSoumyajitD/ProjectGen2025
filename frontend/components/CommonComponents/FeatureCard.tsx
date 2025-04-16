"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";

// Define the interface for the props
interface ThreeDCardDemoProps {
  CardItemOne: string;
  CardItemTwo: string;
  ImageUrl: string;
  ExploreHrefLink: string;
  ButtonName: string;
}

export function ThreeDCardDemo({ CardItemOne, CardItemTwo, ImageUrl, ExploreHrefLink , ButtonName}: ThreeDCardDemoProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {CardItemOne}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {CardItemTwo}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={ImageUrl}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl grayscale hover:grayscale-0 transition-all duration-300"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-end items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href={ExploreHrefLink}
         
            className="px-6 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            {ButtonName} →
          </CardItem>
         
        </div>
      </CardBody>
    </CardContainer>
  );
}