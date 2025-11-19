'use client';
import React, { useState, useEffect } from "react";

interface Props {
  id: number;
  question: string;
  wordLimit?: string;
  onAnswerChange?: (answer: string) => void;
}

const SentenceCompletion: React.FC<Props> = ({ id, question,wordLimit, onAnswerChange }) => {
  const storageKey = `question-sc-${id}`;
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setAnswer(saved);
      if (onAnswerChange) {
        onAnswerChange(saved);
      }
    }
  }, [storageKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    localStorage.setItem(storageKey, e.target.value);
    if (onAnswerChange) {
      onAnswerChange(e.target.value);
    }
  };

  return (
    <div className="p-4 mb-2">
      <p className="text-base mb-2 flex items-center gap-2"><span className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full text-lg font-bold flex-shrink-0">{id}</span>{question}</p>
      <input
        type="text"
         className="border-b-2 border-gray-300 bg-blue-50/50 px-2 py-0.5 w-64 text-center focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-semibold text-blue-700"

        value={answer}
        onChange={handleChange}
        placeholder=""
      />
    </div>
  );
};

export default SentenceCompletion;
