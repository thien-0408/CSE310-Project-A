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

export default ShortAnswer;
