"use client";
import React, { useState, useEffect } from "react";

interface Props {
  id: string; // GUID
  question: string;
  questionNumber: number;
  options: string[]; // ["Option content 1", "Option content 2"...]
  onAnswerChange?: (questionId: string, value: string) => void;
}

const MultipleChoice: React.FC<Props> = ({
  id,
  question,
  questionNumber,
  options,
  onAnswerChange,
}) => {
  const storageKey = `question-mc-${id}`;
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSelected(saved);
        if (onAnswerChange) onAnswerChange(id, saved);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, storageKey]);

  const handleChange = (index: number) => {
    const label = String.fromCharCode(65 + index); // 0->A, 1->B
    setSelected(label);
    localStorage.setItem(storageKey, label);
    if (onAnswerChange) onAnswerChange(id, label);
  };

  return (
    <div className="group p-5 mb-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* --- Question Header --- */}
      <div className="flex items-start gap-4 mb-4">
        {/* Number Badge: Style giống SentenceCompletion */}
        <div className="flex-shrink-0 mt-0.5">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
            {questionNumber}
          </span>
        </div>
        
        {/* Question Text */}
        <div className="flex-1">
          <p className="font-medium text-slate-800 text-lg leading-relaxed">
            {question}
          </p>
        </div>
      </div>

      {/* --- Options List --- */}
      <div className="space-y-2.5 pl-1 md:pl-11"> 
        {options.map((opt, i) => {
          const label = String.fromCharCode(65 + i); // A, B, C, D
          const isSelected = selected === label;

          return (
            <label
              key={i}
              className={`relative flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                isSelected
                  ? "bg-indigo-50 border-indigo-200 shadow-sm z-10"
                  : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="radio"
                  name={`q-${id}`} // Unique name group per question
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-slate-300 focus:ring-indigo-600 focus:ring-2"
                  checked={isSelected}
                  onChange={() => handleChange(i)}
                />
              </div>
              
              <div className="flex gap-2.5 text-slate-700 leading-snug">
                <span className={`font-bold min-w-[20px] ${isSelected ? "text-indigo-700" : "text-slate-500"}`}>
                  {label}.
                </span>
                <span className={`${isSelected ? "text-slate-900 font-medium" : "text-slate-700"}`}>
                  {opt}
                </span>
              </div>
              
              {/* Optional: Checkmark icon khi selected để tăng tính visual feedback */}
              {isSelected && (
                 <div className="absolute right-3 top-3 text-indigo-600 opacity-20 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                 </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;