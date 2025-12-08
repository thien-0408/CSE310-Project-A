"use client";
import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

// Structure câu hỏi từ API
interface QuestionItem {
  id: string; // GUID
  questionNumber: number;
  questionText: string;
  wordLimit?: string | null;
}

interface Props {
  sectionId: string; // GUID
  instruction: string;
  questions: QuestionItem[];
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningShortAnswer: React.FC<Props> = ({
  sectionId,
  instruction,
  questions,
  onAnswerChange,
}) => {
  // Store answers by Question GUID
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-short-answer-${sectionId}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          // Sync lên parent
          Object.entries(parsed).forEach(([qId, val]) => {
            if (onAnswerChange) onAnswerChange(qId, val as string);
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    // Save all answers for this section
    localStorage.setItem(`listening-short-answer-${sectionId}`, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="mb-8 w-full max-w-5xl mx-auto">
      {/* --- HEADER: Technical Box Style --- */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
            Short Answer Questions
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed italic max-w-3xl flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
            {instruction || "Answer the questions below."}
          </p>
        </div>
      </div>

      {/* --- BODY: Questions List --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-6 space-y-2">
        {questions.map((q) => (
          <div 
            key={q.id} 
            className="group flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
          >
            {/* Question Label & Number */}
            <div className="flex gap-4 md:w-1/2 lg:w-5/12">
              <div className="flex-shrink-0 mt-0.5">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
                  {q.questionNumber}
                </span>
              </div>
              <span className="text-slate-800 font-medium text-[1.05rem] leading-snug pt-1">
                {q.questionText}
              </span>
            </div>
            
            {/* Input Field Area */}
            <div className="flex-1 md:mt-0 mt-2 relative">
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="w-full border-b-2 border-slate-300 bg-slate-50/50 px-3 py-2 text-slate-800 font-medium placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all rounded-t-sm"
                placeholder="Type your answer..."
                autoComplete="off"
                spellCheck={false}
              />
              
              {/* Focus Line Animation (Optional) */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 w-0 transition-all duration-300 group-focus-within:w-full"></div>

              {/* Word Limit Helper (Per question) */}
              {q.wordLimit && (
                <div className="mt-1.5 flex justify-end">
                   <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">
                      Limit: {q.wordLimit}
                   </span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningShortAnswer;