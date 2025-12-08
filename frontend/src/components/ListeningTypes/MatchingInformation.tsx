"use client";
import React, { useEffect, useState } from "react";
import { ListeningQuestion, ListeningOption } from "@/types/listening";
import { Info } from "lucide-react";

interface Props {
  sectionId: string; // GUID
  title: string;
  instruction: string;
  options: ListeningOption[]; // Các lựa chọn trong Box (A, B, C...)
  questions: ListeningQuestion[]; // Các câu hỏi (1, 2, 3...)
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const MatchingInformation: React.FC<Props> = ({
  sectionId,
  title,
  instruction,
  options,
  questions,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-matching-${sectionId}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          Object.entries(parsed).forEach(([qId, val]) => {
            if (onAnswerChange) onAnswerChange(qId, val as string);
          });
        } catch (e) { console.error(e); }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    localStorage.setItem(`listening-matching-${sectionId}`, JSON.stringify(updated));
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="mb-8 w-full max-w-5xl mx-auto">
      {/* --- HEADER: Technical Box Style --- */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">
              {title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed italic max-w-3xl flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
              {instruction || "Which paragraph contains the following information?"}
            </p>
          </div>

          {/* NB Note Badge (Thường gặp ở dạng bài này) */}
          <div className="flex-shrink-0 hidden sm:block">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider rounded-md">
              NB: You may use any letter more than once
            </span>
          </div>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-6 space-y-8">
        
        {/* --- OPTIONS BOX (Reference List) --- */}
        {options && options.length > 0 && (
          <div className="bg-slate-50/50 rounded-lg border border-slate-300">
            {/* Box Label */}
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                List of Options / Paragraphs
              </h4>
            </div>
            
            {/* Options Grid */}
            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {options.map((option) => (
                  <div key={option.id} className="flex items-start gap-3 group">
                    <span className="font-serif font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-sm min-w-[28px] text-center border border-indigo-100 select-none">
                      {option.key}
                    </span>
                    <span className="text-sm font-medium text-slate-700 leading-snug group-hover:text-slate-900 transition-colors pt-0.5">
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- QUESTIONS LIST --- */}
        <div className="space-y-2">
          {questions.map((question) => {
            const currentValue = answers[question.id] || "";
            
            return (
              <div 
                key={question.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
              >
                {/* Question Info */}
                <div className="flex gap-4 flex-1 items-start sm:items-center">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all shadow-sm">
                      {question.questionNumber}
                    </span>
                  </div>
                  <span className="text-slate-800 font-medium text-[1.05rem] leading-snug">
                    {question.questionText}
                  </span>
                </div>
                
                {/* Dropdown Selection */}
                <div className="w-full sm:w-48 pl-12 sm:pl-0 flex-shrink-0">
                  <div className="relative">
                    <select
                      value={currentValue}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className={`appearance-none w-full px-4 py-2.5 border rounded-md text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-sm transition-all
                        ${currentValue 
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/50" 
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                        }
                      `}
                    >
                      <option value="" disabled className="text-slate-400 font-normal">Select...</option>
                      {options.map((opt) => (
                        <option key={opt.id} value={opt.key}>
                          {opt.key}
                        </option>
                      ))}
                    </select>

                    {/* Custom Arrow Icon */}
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

export default MatchingInformation;