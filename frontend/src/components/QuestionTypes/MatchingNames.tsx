"use client";
import React, { useState, useEffect } from "react";
import { ReadingSection } from "@/types/ReadingInterfaces";

interface Props {
  section: ReadingSection;
  onAnswerChange?: (questionId: string, value: string) => void;
}

const MatchingNames: React.FC<Props> = ({ section, onAnswerChange }) => {
  const sectionId = section?.sectionId || "unknown";
  const storageKey = `matching-names-${sectionId}`;

  const [answers, setAnswers] = useState<Record<string, string>>({});

  // --- Load saved answers ---
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

  const getLabel = (idx: number, key?: string | null) => {
    return key ? key : String.fromCharCode(65 + idx);
  };
  
  const nameOptions = section.sectionOptions || [];

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
            {section.instructions || "Match each statement with the correct person below."}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-6 space-y-8">
        
        {/* --- REFERENCE BOX: List of Options (Names) --- */}
        {nameOptions.length > 0 && (
          <div className="bg-slate-50/50 rounded-lg border border-slate-300">
            {/* Box Label */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                List of People / Options
              </h4>
            </div>
            
            {/* Names Grid */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                {nameOptions.map((opt, index) => {
                  const label = getLabel(index, opt.key);
                  return (
                    <div
                      key={opt.id || index}
                      className="flex items-start gap-3 group"
                    >
                      <span className="font-serif font-bold text-indigo-700 min-w-[20px] pt-0.5 select-none">
                        {label}
                      </span>
                      <span className="text-slate-700 text-sm font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>
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
                <div className="flex gap-4 flex-1 items-start sm:items-center">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
                      {displayNum}
                    </span>
                  </div>
                  <p className="text-slate-800 text-[1.05rem] font-medium leading-relaxed">
                    {q.questionText}
                  </p>
                </div>

                {/* Dropdown Select */}
                <div className="w-full sm:w-60 flex-shrink-0 pl-12 sm:pl-0">
                  <div className="relative">
                    <select
                      value={currentValue} 
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className={`appearance-none w-full border rounded-md px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm
                        ${
                          currentValue
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/50"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                        }
                      `}
                    >
                      <option value="" disabled className="text-slate-400 font-normal">
                        Select answer...
                      </option>
                      {nameOptions.map((opt, idx) => {
                        const label = getLabel(idx, opt.key);
                        // Truncate logic for clean dropdown
                        const truncatedText =
                          opt.text.length > 25
                            ? opt.text.substring(0, 25) + "..."
                            : opt.text;
                        return (
                          <option key={opt.id || idx} value={label}>
                            {label}. {truncatedText}
                          </option>
                        );
                      })}
                    </select>

                    {/* Custom Arrow Icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
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

export default MatchingNames;