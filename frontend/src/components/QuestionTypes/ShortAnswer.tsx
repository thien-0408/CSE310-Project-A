"use client";
import React, { useState, useEffect } from "react";

interface Props {
  id: string; // GUID
  question: string;
  wordLimit?: string;
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ShortAnswer: React.FC<Props> = ({ id, question, wordLimit, onAnswerChange }) => {
  const storageKey = `question-short-${id}`;
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setAnswer(saved);
        if (onAnswerChange) onAnswerChange(id, saved);
      }
    }
  }, [id, storageKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAnswer(val);
    localStorage.setItem(storageKey, val);
    if (onAnswerChange) onAnswerChange(id, val);
  };

  return (
    <div className="p-4 mb-2 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Thay vì hiển thị ID (GUID) dài ngoằng, ta dùng question text hoặc để parent đánh số */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
        <p className="text-gray-800 text-base leading-relaxed flex-1 font-medium">
          {question}
        </p>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <input
            type="text"
            className="border-b-2 border-gray-300 bg-blue-50/50 px-2 py-1 w-48 text-center focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-semibold text-blue-700 placeholder-gray-400 text-sm"
            value={answer}
            onChange={handleChange}
            placeholder="Answer..."
            autoComplete="off"
          />
        </div>
      </div>
      {wordLimit && (
        <p className="text-xs text-red-500 mt-1 italic text-right">
          {wordLimit}
        </p>
      )}
    </div>
  );
};

export default ShortAnswer;