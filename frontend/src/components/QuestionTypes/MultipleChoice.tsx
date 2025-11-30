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
  }, [id, storageKey]);

  const handleChange = (index: number) => {
    const label = String.fromCharCode(65 + index); // 0->A, 1->B
    setSelected(label);
    localStorage.setItem(storageKey, label);
    if (onAnswerChange) onAnswerChange(id, label);
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-start gap-3 w-full">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm mt-0.5">
          {questionNumber}
        </div>
        <div className="flex-1 mt-1">
          <p className="font-semibold text-gray-800 text-lg leading-snug">
            {question}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {options.map((opt, i) => {
          const label = String.fromCharCode(65 + i); // A, B, C, D
          const isSelected = selected === label;

          return (
            <label
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                isSelected
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50 border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="radio"
                  name={`q-${id}`} // Unique name group per question
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  checked={isSelected}
                  onChange={() => handleChange(i)}
                />
              </div>
              <div className="flex gap-2 text-gray-700">
                <span className="font-bold text-gray-900 min-w-[20px]">
                  {label}.
                </span>
                <span>{opt}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;
