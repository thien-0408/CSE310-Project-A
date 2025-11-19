"use client";
import NavbarTest from "@/components/ui/navbarfortest";
import ListeningRenderer from "@/components/AudioRenderer";
import React, { useState } from "react";
import listeningData from "@/data/listeningJson/part1.json";
import ListeningScoring from "@/components/ListeningScoring";
import { Button } from "@/components/ui/button";
import { GrNext, GrPrevious } from "react-icons/gr";
import Loader from "@/components/ui/Loader";
import { ListeningData } from "@/types/listening"; 
import ScrollToTopButton from "@/components/ui/testscroller";


interface UserAnswer {
  sectionId: number;
  questionId: number;
  answer: unknown;
}

export default function ListeningTest() {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const typedListeningData = listeningData as ListeningData;

  const handleAnswerChange = (sectionId: number, questionId: number, answer: unknown) => {
    setUserAnswers(prev => {
      const existingIndex = prev.findIndex(
        ua => ua.sectionId === sectionId && ua.questionId === questionId
      );
      
      if (existingIndex !== -1) {
        // Update existing answer
        const updated = [...prev];
        updated[existingIndex] = { sectionId, questionId, answer };
        return updated;
      } else {
        // Add new answer
        return [...prev, { sectionId, questionId, answer }];
      }
    });
  };
  
  const handleSubmit = () => {
    // Optional: Validate that all questions are answered
    console.log('Submitting answers:', userAnswers);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    // Optional: Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total questions for progress tracking
  const getTotalQuestions = () => {
    let total = 0;
    listeningData.sections.forEach(section => {
      if (section.formFields) {
        total += section.formFields.filter(f => f.isInput).length;
      }
      if (section.questions) {
        total += section.questions.length;
      }
      if (section.steps) total += section.steps.length;  
    });
    return total;
  };

  const totalQuestions = getTotalQuestions();
  const answeredQuestions = userAnswers.length;

  if (showResults) {
    return (
      <>
        <Loader />
        <NavbarTest />
        <ListeningScoring
          listeningData={typedListeningData}
          userAnswers={userAnswers}
          onClose={handleCloseResults}
        />
      </>
    );
  }

  return (
    <>
      {/* <header>
        <NavbarTest />
      </header> */}

      <main className="font-roboto">
        <ListeningRenderer
          listeningData={typedListeningData}
          onAnswerChange={handleAnswerChange}
        />
      </main>

      <footer className="sticky bottom-0 w-full bg-white shadow-inner border-t p-3 flex items-center justify-center space-x-5">
        <div>
          <h3 className="text-gray-800 text-md">
            Progress: {answeredQuestions} / {totalQuestions} answered
          </h3>
        </div>
        
        <div>
          <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300">
            <GrPrevious />
          </Button>
        </div>
        <div>
          <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300">
            <GrNext />
          </Button>
        </div>
        
        <div>
          <Button
            className="rounded-3xl bg-[#407db9] hover:bg-[#336699] transition-all duration-300"
            onClick={handleSubmit}
            disabled={answeredQuestions === 0}
          >
            Submit
          </Button>
        </div>
      </footer>
      <ScrollToTopButton></ScrollToTopButton>
    </>
  );
}