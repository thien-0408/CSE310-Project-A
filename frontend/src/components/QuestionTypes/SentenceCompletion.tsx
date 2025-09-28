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
      <h1 className="mb-2 tracking-tight font-medium bg-gray-100">Complete the sentences below. <br /> Choose <span className=" text-[#407db9] font-bold">{wordLimit}</span> from the passage for each answer. Write your answers in boxes on your answer sheet.</h1>
      <p className="font-semibold mb-2">{id}. {question}</p>
      <input
        type="text"
        className="border rounded px-2 py-1 w-full"
        value={answer}
        onChange={handleChange}
        placeholder="Your answer"
      />
    </div>
  );
};

export default SentenceCompletion;
