"use client";
import React, { useEffect, useState } from "react";
import { ReadingQuestion } from "@/types/ReadingInterfaces";
import { Info } from "lucide-react";

interface Props {
  id: string;
  sectionTitle?: string; // --- NEW PROP ---
  question: string;      // Instructions (e.g. "Complete the summary below...")
  text: string;          // Text content with placeholders ___1___
  questions?: ReadingQuestion[];
  blanks?: unknown[];
  wordLimit?: string;
  onAnswerChange?: (answers: Record<string, string>) => void;
}

const GapFilling: React.FC<Props> = ({
  id,
  sectionTitle,
  question,
  text,
  questions,
  wordLimit,
  onAnswerChange,
}) => {
  const storageKey = `section-gap-${id}`;
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // --- Load saved answers ---
  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (onAnswerChange) onAnswerChange(updated);
  };

  const getQuestionIdByNumber = (num: number): string | undefined => {
    if (questions) {
      const q = questions.find((x) => x.questionNumber === num);
      return q?.id;
    }
    return undefined;
  };

  // Regex logic to find placeholders like ___1___ or __1__
  const splitRegex = /(___?\d+___?)/g;
  const matchRegex = /___?(\d+)___?/;

  return (
    <div className="mb-8 w-full max-w-5xl mx-auto">
      {/* --- HEADER: Technical Box Style --- */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            {sectionTitle && (
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {sectionTitle}
              </h3>
            )}
            <p className="text-slate-600 text-sm leading-relaxed italic max-w-3xl">
              {question || "Complete the text below. Write NO MORE THAN TWO WORDS for each answer."}
            </p>
          </div>

          {/* Word Limit Badge */}
          {wordLimit && (
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs font-bold uppercase tracking-wide shadow-sm">
              <Info className="w-3.5 h-3.5" />
              {wordLimit}
            </div>
          )}
        </div>
      </div>

      {/* --- BODY: Text Content with Gaps --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-8">
        <div className="leading-[2.8rem] text-slate-800 text-[1.05rem] text-justify font-serif md:font-sans">
          {text.split(splitRegex).map((part, i) => {
            const match = part.match(matchRegex);

            if (match) {
              const questionNumber = parseInt(match[1], 10);
              const questionId = getQuestionIdByNumber(questionNumber);

              if (questionId) {
                return (
                  <span
                    key={i}
                    className="inline-flex items-baseline mx-1.5 relative group"
                  >
                    {/* Question Number (Small Sup/Label) */}
                    <span className="text-[1rem] font-bold text-slate-500 bg-slate-100 px-3 rounded absolute  left-0 shadow-sm border border-slate-200 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                      {questionNumber}
                    </span>
                    
                    {/* Input Field */}
                    <input
                      type="text"
                      value={answers[questionId] || ""}
                      onChange={(e) => handleChange(questionId, e.target.value)}
                      className="min-w-[140px] border-b-2 border-slate-300 bg-slate-50/50 px-2 py-0.5 text-center font-bold text-indigo-700 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 rounded-t-sm"
                      autoComplete="off"
                      aria-label={`Answer for question ${questionNumber}`}
                    />
                  </span>
                );
              }
              return (
                <span key={i} className="text-red-500 font-bold mx-1 text-xs">
                  [Err Q{questionNumber}]
                </span>
              );
            }
            // Render text parts
            return <span key={i}>{part}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

export default GapFilling;