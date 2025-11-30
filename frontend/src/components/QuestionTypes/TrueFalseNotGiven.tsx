"use client";
import React, { useState, useEffect } from "react";

interface Props {
  id: string; // GUID
  question: string;
  questionNumber: number;
  options: string[]; // ["True", "False", "Not Given"]
  onAnswerChange?: (questionId: string, value: string) => void;
}

const TrueFalseNotGiven: React.FC<Props> = ({
  id,
  question,
  questionNumber,
  options,
  onAnswerChange,
}) => {
  const storageKey = `question-tfng-${id}`;
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

  const handleChange = (value: string) => {
    setSelected(value);
    localStorage.setItem(storageKey, value);
    if (onAnswerChange) onAnswerChange(id, value);
  };

  return (
    <div className="flex items-start gap-4 mb-6 bg-white  hover:border-gray-200 transition-colors">
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm mt-1">
        {questionNumber}
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          className={`border rounded px-3 py-2 text-sm font-semibold min-w-[130px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer
            ${selected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700 bg-white"}
          `}
        >
          <option value="" disabled>Select Answer</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <p className="text-gray-800 text-base leading-relaxed font-medium">
          {question}
        </p>
      </div>
    </div>
  );
};

export default TrueFalseNotGiven;