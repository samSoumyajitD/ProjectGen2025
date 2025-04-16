"use client";
import { Accordion, AccordionItem, Button } from "@heroui/react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  { question: "What is AI Professor?", answer: "AI Professor is an intelligent tool designed to provide subject-specific query resolution, helping students get instant answers and boost their understanding." },
  { question: "What is Roadmap Generator?", answer: "The Roadmap Generator creates chapter-wise study plans tailored to individual learning needs." },
  { question: "Is there a cost?", answer: "Our basic tools are available for free." },
  { question: "Can I get support?", answer: "Yes, we offer comprehensive support for all users. You can reach out via our contact page for assistance." },
  { question: "How does AI Professor work?", answer: "AI Professor uses advanced machine learning algorithms to analyze questions and provide accurate, subject-specific answers in real-time." },
  { question: "How accurate are the generated roadmaps?", answer: "The Roadmap Generator is designed to provide highly relevant study plans based on user input, but we recommend users review and adjust based on personal preferences." },
];

export default function FAQ() {
  return (
    <div className="dark:bg-gray-900 dark:text-white p-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl sm:text-5xl font-bold text-center text-neutral-800 dark:text-neutral-200">
        FAQs
      </h1>
      <p className="text-base sm:text-lg text-center text-neutral-600 dark:text-neutral-400 mt-4 mb-12 sm:mb-24">
        Find answers to common questions about our tools and services.
      </p>
<div className="animate-floatEven">
      <Accordion variant="splitted" >
        {faqData.map((item: FAQItem, index: number) => (
          <AccordionItem key={index} aria-label={`Accordion ${index + 1}`} title={<span className="dark:text-white font-bold text-black">{item.question}</span>}>
            {item.answer}
          </AccordionItem>
        ))}
      </Accordion>
      </div>
      <div className="mt-24 p-4 border-t border-gray-300 dark:border-gray-600 text-center">
        <h2 className="text-xl pt-4 font-semibold dark:text-white text-black">Need Help? Get in Touch!</h2>
        <p className="dark:text-gray-300 text-gray-700 mb-4">Our team is here to support you.</p>
        <Button className="text-white bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-500 px-6 py-3 rounded-full font-medium">
          <a href="/contact">Contact Us</a>
        </Button>
      </div>
    </div>
  );
}

