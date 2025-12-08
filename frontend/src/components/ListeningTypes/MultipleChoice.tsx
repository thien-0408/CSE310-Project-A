"use client";
import React, { useEffect, useState } from "react";

interface ListeningOption {
  id?: string;
  key: string;  
  text: string; 
}

interface Props {
  id: string; // GUID
  questionNumber: number;
  question: string;
  options: ListeningOption[]; 
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningMultipleChoice: React.FC<Props> = ({
  id,
  questionNumber,
  question,
  options,
  onAnswerChange,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    const storageKey = `listening-mc-${id}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSelectedKey(saved);
        if (onAnswerChange) onAnswerChange(id, saved);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    localStorage.setItem(`listening-mc-${id}`, key);
    if (onAnswerChange) onAnswerChange(id, key);
  };

  return (
    <div className="group p-5 mb-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* --- Question Header --- */}
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-shrink-0 mt-0.5">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
            {questionNumber}
          </span>
        </div>

        {/* Question Text */}
        <div className="flex-1">
          <h4 className="font-medium text-slate-800 text-lg leading-relaxed">
            {question}
          </h4>
        </div>
      </div>

      {/* --- Options List --- */}
      <div className="space-y-3 pl-1 md:pl-11">
        {options.map((opt) => {
          const isSelected = selectedKey === opt.key;

          return (
            <label
              key={opt.key}
              className={`relative flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all duration-200 group/option ${
                isSelected
                  ? "bg-indigo-50 border-indigo-200 shadow-sm z-10"
                  : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {/* Radio Input */}
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="radio"
                  name={`question-${id}`}
                  checked={isSelected}
                  onChange={() => handleSelect(opt.key)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-slate-300 focus:ring-indigo-600 focus:ring-2 cursor-pointer"
                />
              </div>

              {/* Label Content */}
              <div className="flex gap-2.5 text-slate-700 leading-snug flex-1">
                <span 
                  className={`font-bold min-w-[20px] transition-colors ${
                    isSelected 
                      ? "text-indigo-700" 
                      : "text-slate-500 group-hover/option:text-slate-700"
                  }`}
                >
                  {opt.key}.
                </span>
                <span 
                  className={`transition-colors ${
                    isSelected 
                      ? "text-slate-900 font-medium" 
                      : "text-slate-700"
                  }`}
                >
                  {opt.text}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ListeningMultipleChoice;