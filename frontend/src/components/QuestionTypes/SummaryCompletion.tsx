"use client";
import React, { useState, useEffect } from "react";

interface Props {
  id: string; // GUID
  question: string;
  range?: string;
  questionRange?: string;
  options?: string[]; // Danh sách từ để chọn (nếu có)
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const SummaryCompletion: React.FC<Props> = ({
  id,
  question,
  options,
  onAnswerChange,
}) => {
  const storageKey = `question-sumc-${id}`;
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setAnswer(saved);
        if (onAnswerChange) onAnswerChange(id, saved);
      }
    }
  }, [id, storageKey]);

  const handleChange = (val: string) => {
    setAnswer(val);
    localStorage.setItem(storageKey, val);
    if (onAnswerChange) onAnswerChange(id, val);
  };

  return (
    <div className="p-4 mb-2 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-800 text-base leading-relaxed">
          {question}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-blue-600">Answer:</span>
          
          {options && options.length > 0 ? (
            // Nếu có options (dạng box), dùng dropdown hoặc input có gợi ý
            <select
              value={answer}
              onChange={(e) => handleChange(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none w-48"
            >
              <option value="">Select option</option>
              {options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            // Nếu không có options, dùng input text thường
            <input
              type="text"
              className="border-b-2 border-gray-300 bg-blue-50/50 px-3 py-1 w-64 text-center focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-blue-700"
              value={answer}
              onChange={(e) => handleChange(e.target.value)}
              autoComplete="off"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCompletion;