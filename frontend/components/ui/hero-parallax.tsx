"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { TypewriterEffectSmooth } from './typewriter-effect'; // Adjust the import path as necessary

interface Word {
  text: string;
  className?: string; // Optional className for individual words
}

interface TypewriterEffectSmoothDemoProps {
  words: Word[]; // `words` is an array of objects with `text` and optional `className`
  className?: string; // Optional className for the container
  cursorClassName?: string; // Optional className for the cursor
}

export function TypewriterEffectSmoothDemo({
  words,
  className,
  cursorClassName,
}: TypewriterEffectSmoothDemoProps) {
  return (
    <div className={className}>
      <TypewriterEffectSmooth
        words={words}
        cursorClassName={cursorClassName}
      />
    </div>
  );
}

interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

interface HeroParallaxProps {
  words: Word[];
  products: Product[];
  subHeader: string;
}

export const HeroParallax = ({
  words,
  products,
  subHeader,
}: HeroParallaxProps) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 50]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[140vh] sm:h-[170vh] overflow-hidden dark:bg-black antialiased relative flex flex-col self-auto [perspective:800px] [transform-style:preserve-3d]"
    >
      <Header words={words} subHeader={subHeader} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-10">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-10 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

interface HeaderProps {
  words: Word[];
  subHeader: string;
}

export const Header = ({ words, subHeader }: HeaderProps) => {
  return (
    <div className="max-w-7xl dark:bg-black relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className=" font-bold dark:text-white text-gray-900 mb-4">
        <TypewriterEffectSmoothDemo
          words={words}
          cursorClassName="text-red-500  animate-blink"
        />
      </h1>

      <p className="max-w-2xl text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
        {subHeader}
      </p>
      <div className="bg-white dark:bg-black flex items-center justify-start">
        <div className="flex flex-col text-[10px] md:text-[20px] md:flex-row items-center justify-center gap-4 pt-6 mt-4 z-50">
          <motion.div
         
            className="w-full md:w-auto"
          >
          
          <div className="flex flex-row space-x-4">
  <Link href="/auth?form=signup" passHref>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-2 rounded-xl text-sm md:px-12  font-semibold shadow-lg transition-all duration-300 border border-gray-700 dark:border-gray-300 
                 bg-gradient-to-r from-black via-gray-900 to-gray-800 hover:from-gray-900 hover:via-gray-800 hover:to-gray-700 
                 dark:from-gray-300 dark:via-gray-200 dark:to-gray-100 dark:hover:from-gray-200 dark:hover:via-gray-100 dark:hover:to-gray-300 
                 text-white dark:text-gray-900 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-200 outline-none"
    >
      Join Now
    </motion.button>
  </Link>

  <Link href="/auth?form=login" passHref>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-2 md:px-12 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 border border-gray-300 dark:border-gray-700 
                 bg-gradient-to-r from-gray-100 via-gray-200 to-white hover:from-gray-200 hover:via-gray-100 hover:to-gray-50 
                 dark:from-gray-900 dark:via-gray-800 dark:to-black dark:hover:from-gray-800 dark:hover:via-gray-900 dark:hover:to-gray-700 
                 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-200 outline-none"
    >
      Continue
    </motion.button>
  </Link>
</div>
         
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  translate: MotionValue<number>;
}

export const ProductCard = ({
  product,
  translate,
}: ProductCardProps) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
          priority // Add priority for above-the-fold images
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};