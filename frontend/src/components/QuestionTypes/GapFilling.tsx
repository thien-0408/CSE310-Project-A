"use client";
import React, { useEffect, useState } from "react";
import { Blank } from "@/types/reading"; 

interface Props {
  id: number; // Section ID
  question: string; // Instructions
  text: string;
  blanks: Blank[];
  wordLimit?: string;
  onAnswerChange?: (answers: Record<number, string>) => void;
}

const GapFilling: React.FC<Props> = ({
  id,
  question,
  text,
  blanks,
  wordLimit,
  onAnswerChange,
}) => {
  const storageKey = `section-gap-${id}`; 
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        if (onAnswerChange) onAnswerChange(parsed);
      } catch (e) {
        console.error("Error parsing saved answers", e);
      }
    }
  }, []); 

  const handleChange = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) onAnswerChange(updated);
  };

  const validIds = new Set(blanks.map((b) => b.index));

  return (
    <div className="p-6 mb-6 bg-white rounded-xl">
      {wordLimit && (
        <p className="text-sm text-gray-500 mb-4 italic font-medium">
          {wordLimit}
        </p>
      )}

      <div className="leading-loose text-gray-700 text-base">
        {text.split(/(___\d+___)/g).map((part, i) => {
          const match = part.match(/___(\d+)___/);
          
          if (match) {
            const questionId = parseInt(match[1], 10);
            
            if (validIds.has(questionId)) {
              return (
                <span key={i} className="inline-flex items-center mx-1 relative">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-md font-bold flex-shrink-0 border border-gray-200">
                    {questionId}
                  </span>
                  <input
                    type="text"
                    value={answers[questionId] || ""}
                    onChange={(e) => handleChange(questionId, e.target.value)}
                    className="font-semibold border-b-2 border-gray-300 bg-blue-50/50 px-2 py-0.5 w-32 text-center focus:border-blue-500 focus:bg-white focus:outline-none transition-all  text-blue-700"
                    autoComplete="off"
                  />
                </span>
              );
            }
            return <span key={i} className="text-red-500 font-bold">[Invalid ID: {questionId}]</span>;
          }
          
          return <span key={i}>{part}</span>;
        })}
      </div>
    </div>
  );
};

export default GapFilling;