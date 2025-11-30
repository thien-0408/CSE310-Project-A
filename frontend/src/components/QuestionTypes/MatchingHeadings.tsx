"use client";
import React, { useState, useEffect } from "react";
import { ReadingSection } from "@/types/ReadingInterfaces";

interface Props {
  section: ReadingSection;
  onAnswerChange?: (questionId: string, value: string) => void;
}

// Convert numbers to Roman numerals (Enhanced version)
const toRoman = (num: number): string => {
  const lookup: Record<string, number> = {
    x: 10, ix: 9, v: 5, iv: 4, i: 1
  };
  let roman = "";
  let n = num;
  // eslint-disable-next-line prefer-const
  for (let i in lookup) {
    while (n >= lookup[i]) {
      roman += i;
      n -= lookup[i];
    }
  }
  return roman; 
};

const MatchingHeadings: React.FC<Props> = ({ section, onAnswerChange }) => {
  const sectionId = section?.sectionId || "unknown";
  const storageKey = `matching-headings-${sectionId}`;
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined" && sectionId !== "unknown") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          if (onAnswerChange) {
             Object.entries(parsed).forEach(([qId, val]) => {
                onAnswerChange(qId, val as string);
             });
          }
        } catch (e) {
          console.error("Error parsing saved answers", e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  if (!section) return null;

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  const headings = section.sectionOptions || [];

  return (
    <div className="bg-white mb-6">
      {/* Title & Instructions */}
      {section.sectionTitle && (
        <h3 className="text-lg font-bold text-gray-800 mb-2">{section.sectionTitle}</h3>
      )}
      <p className="text-sm text-gray-600 mb-6 italic">
        {section.instructions || "Choose the correct heading for each paragraph from the list of headings below."}
      </p>

      {/* List of Headings Box */}
      {headings.length > 0 && (
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-8 shadow-sm">
          <h4 className="font-bold text-slate-700 mb-4 uppercase text-xs tracking-wider border-b border-slate-200 pb-2">
            List of Headings
          </h4>
          <ul className="space-y-3">
            {headings.map((heading, idx) => {
              const displayKey = (heading.key && isNaN(Number(heading.key))) 
                ? heading.key 
                : toRoman(idx + 1);

              return (
                <li key={idx} className="text-sm text-gray-700 flex gap-3 items-start">
                  <span className="font-bold min-w-[30px] text-right text-blue-600">
                    {displayKey}
                  </span>
                  <span className="leading-relaxed">{heading.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {section.questions.map((q, index) => {
          const displayNum = q.questionNumber > 0 ? q.questionNumber : index + 1;
          const currentValue = answers[q.id] || "";

          return (
            <div 
              key={q.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
            >
              {/* Question Number & Text */}
              <div className="flex gap-3 flex-1 items-center">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0 shadow-sm">
                  {displayNum}
                </span>
                <span className="flex-1 font-medium text-gray-800 text-base">
                  {q.questionText}
                </span>
              </div>

              {/* Dropdown Options with Visual Feedback */}
              <div className="w-full sm:w-48 flex-shrink-0 pl-11 sm:pl-0">
                <select
                  value={currentValue}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={`w-full border rounded-md px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm
                    ${currentValue 
                      ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" 
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }
                  `}
                >
                  <option value="" disabled>Select Heading</option>
                  {headings.map((h, idx) => {
                    const val = (h.key && isNaN(Number(h.key))) 
                        ? h.key 
                        : toRoman(idx + 1);
                    
                    // Truncate text for dropdown option if too long
                    const truncatedText = h.text.length > 40 
                      ? h.text.substring(0, 40) + "..." 
                      : h.text;

                    return (
                      <option key={idx} value={val}>
                        {val}. {truncatedText}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchingHeadings;