/* eslint-disable prefer-const */
"use client";
import React, { useState, useEffect } from "react";
import { ReadingSection } from "@/types/ReadingInterfaces";

interface Props {
  section: ReadingSection;
  onAnswerChange?: (questionId: string, value: string) => void;
}

// Convert numbers to Roman numerals
const toRoman = (num: number): string => {
  const lookup: Record<string, number> = {
    x: 10, ix: 9, v: 5, iv: 4, i: 1
  };
  let roman = "";
  let n = num;
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
    <div className="mb-8 w-full max-w-5xl mx-auto">
      {/* --- HEADER: Technical Box Style --- */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          {section.sectionTitle && (
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">
              {section.sectionTitle}
            </h3>
          )}
          <p className="text-slate-600 text-sm leading-relaxed max-w-3xl italic">
            {section.instructions || "Choose the correct heading for each paragraph from the list of headings below."}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-6 space-y-8">
        
        {/* --- REFERENCE BOX: List of Headings --- */}
        {headings.length > 0 && (
          <div className="bg-slate-50/50 rounded-lg border border-slate-300">
            {/* Box Label */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                List of Headings
              </h4>
            </div>
            
            {/* Headings Content */}
            <div className="p-5">
              <ul className="space-y-3">
                {headings.map((heading, idx) => {
                  const displayKey = (heading.key && isNaN(Number(heading.key))) 
                    ? heading.key 
                    : toRoman(idx + 1);

                  return (
                    <li key={idx} className="flex gap-4 items-baseline group">
                      <span className="font-serif font-bold min-w-[35px] text-right text-indigo-700 select-none text-sm">
                        {displayKey}
                      </span>
                      <span className="text-slate-700 text-[0.95rem] leading-snug group-hover:text-slate-900 transition-colors">
                        {heading.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* --- QUESTIONS LIST --- */}
        <div className="space-y-1">
          {section.questions.map((q, index) => {
            const displayNum = q.questionNumber > 0 ? q.questionNumber : index + 1;
            const currentValue = answers[q.id] || "";

            return (
              <div 
                key={q.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
              >
                {/* Question Badge & Text */}
                <div className="flex gap-4 flex-1 items-center">
                  <div className="flex-shrink-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
                      {displayNum}
                    </span>
                  </div>
                  <span className="flex-1 font-medium text-slate-800 text-lg">
                    {q.questionText}
                  </span>
                </div>

                {/* Dropdown Select */}
                <div className="w-full sm:w-56 flex-shrink-0 pl-12 sm:pl-0">
                  <div className="relative">
                    <select
                      value={currentValue}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className={`appearance-none w-full border rounded-md px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm
                        ${currentValue 
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/50" 
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                        }
                      `}
                    >
                      <option value="" disabled className="text-slate-400">Select Heading...</option>
                      {headings.map((h, idx) => {
                        const val = (h.key && isNaN(Number(h.key))) 
                            ? h.key 
                            : toRoman(idx + 1);
                        
                        // Truncate text logic
                        const truncatedText = h.text.length > 35 
                          ? h.text.substring(0, 35) + "..." 
                          : h.text;

                        return (
                          <option key={idx} value={val}>
                            {val.toUpperCase()}. {truncatedText}
                          </option>
                        );
                      })}
                    </select>
                    
                    {/* Custom Arrow Icon for Select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingHeadings;