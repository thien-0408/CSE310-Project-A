'use client';
import React, { useState, useEffect } from "react";

interface Props {
  id: number;
  question: string;
  onAnswerChange?: (answer: string) => void;
}

const ShortAnswer: React.FC<Props> = ({ id, question, onAnswerChange }) => {
  const storageKey = `question-sa-${id}`;
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
      <p className="font-semibold mb-2 flex items-center gap-2"><span className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full text-lg font-bold flex-shrink-0">{id}</span>{question}</p>
      <input
        type="text"
        className="border rounded px-2 py-1 w-full hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
        value={answer}
        onChange={handleChange}
        placeholder="Your answer"
      />
    </div>
  );
};

export default ShortAnswer;
