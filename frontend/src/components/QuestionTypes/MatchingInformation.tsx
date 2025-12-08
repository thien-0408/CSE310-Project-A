"use client";
import React, { useState, useEffect } from "react";
import { ReadingSection } from "@/types/ReadingInterfaces";
import { Info } from "lucide-react";

interface Props {
  section: ReadingSection;
  onAnswerChange?: (questionId: string, value: string) => void;
}

const MatchingInformation: React.FC<Props> = ({ section, onAnswerChange }) => {
  const sectionId = section?.sectionId || "unknown";
  const storageKey = `matching-info-${sectionId}`;
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

  // --- Handle Change ---
  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  const paragraphOptions = section.sectionOptions || [];

  return (
    <div className="mb-8 w-full max-w-5xl mx-auto">
      {/* --- HEADER: Technical Box Style --- */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              {section.sectionTitle && (
                <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">
                  {section.sectionTitle}
                </h3>
              )}
              <p className="text-slate-600 text-sm leading-relaxed italic">
                {section.instructions ||
                  "Which paragraph contains the following information? Choose the correct letter, A, B, C, etc."}
              </p>
            </div>
            
            {/* NB Note */}
            <div className="hidden sm:flex flex-shrink-0 items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded text-indigo-800 text-xs font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>NB: You may use any letter more than once</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY: Questions List --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-6 space-y-2">
        {section.questions.map((q, index) => {
          const displayNum = q.questionNumber > 0 ? q.questionNumber : index + 1;
          const currentValue = answers[q.id] || "";

          return (
            <div
              key={q.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
            >
              {/* Question Text */}
              <div className="flex gap-4 flex-1 items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
                    {displayNum}
                  </span>
                </div>
                <span className="flex-1 text-slate-800 text-[1.05rem] leading-snug font-medium">
                  {q.questionText}
                </span>
              </div>

              {/* Dropdown Select */}
              <div className="w-full sm:w-40 flex-shrink-0 pl-11 sm:pl-0">
                <div className="relative">
                  <select
                    value={currentValue}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className={`appearance-none w-full border rounded-md px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm
                      ${
                        currentValue
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/50"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                      }
                    `}
                  >
                    <option value="" disabled className="text-slate-400 font-normal">
                      Select...
                    </option>
                    
                    {/* --- MAP OPTIONS TO A, B, C, D --- */}
                    {paragraphOptions.map((opt, idx) => {
                      // Tạo chữ cái dựa trên index: 0->A, 1->B, 2->C...
                      const letter = String.fromCharCode(65 + idx);
                      
                      return (
                        <option key={idx} value={letter}>
                           {letter}
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
  );
};

export default MatchingInformation;