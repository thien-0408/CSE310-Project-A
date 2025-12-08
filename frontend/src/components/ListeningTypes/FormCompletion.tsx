"use client";
import React, { useEffect, useState } from "react";
import { ListeningQuestion } from "@/types/listening";
import { Info } from "lucide-react";

interface Props {
  id: string; // Section GUID
  title: string;
  instruction: string;
  wordLimit: string;
  questions: ListeningQuestion[];
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const FormCompletion: React.FC<Props> = ({
  id,
  title,
  instruction,
  wordLimit,
  questions,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-form-${id}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          Object.entries(parsed).forEach(([qId, val]) => {
            if (onAnswerChange) onAnswerChange(qId, val as string);
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(`listening-form-${id}`, JSON.stringify(updated));
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
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              {title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed italic">
              {instruction}
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

      {/* --- FORM BODY --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {questions.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-12 group transition-colors hover:bg-slate-50/30"
            >
              {/* --- LABEL COLUMN (Left) --- */}
              <div className="md:col-span-4 lg:col-span-3 bg-slate-50/80 p-4 flex items-center border-b md:border-b-0 md:border-r border-slate-100">
                <span className="font-semibold text-slate-700 text-sm md:text-base leading-snug">
                  {field.label || field.questionText}
                </span>
              </div>

              {/* --- INPUT COLUMN (Right) --- */}
              <div className="md:col-span-8 lg:col-span-9 p-4 flex items-center">
                {field.isInput ? (
                  <div className="flex items-center gap-4 w-full">
                    {/* Badge Number */}
                    <span className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
                      {field.questionNumber}
                    </span>

                    {/* Input Field (Underlined Style) */}
                    <div className="flex-1 max-w-md relative">
                      <input
                        type="text"
                        value={answers[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full border-b-2 border-slate-300 bg-transparent px-3 py-1.5 text-slate-800 font-medium placeholder:text-slate-300 focus:border-indigo-600 focus:outline-none focus:bg-indigo-50/10 transition-all text-base"
                        placeholder="Answer..."
                        autoComplete="off"
                        spellCheck={false}
                      />
                      {/* Focus Indicator (Optional visual flair) */}
                      <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 w-0 transition-all duration-300 group-focus-within:w-full"></div>
                    </div>
                  </div>
                ) : (
                  // Static Value (e.g. "John Smith")
                  <span className="text-slate-900 font-bold text-base px-1">
                    {field.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormCompletion;