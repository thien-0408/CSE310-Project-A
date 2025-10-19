"use client";
import React, { useState, useEffect } from "react";

interface Props {
  id: number;
  question: string;
  range?: string;
  questionRange?: string;
  options?: string[];
  onAnswerChange?: (answer: string) => void;
}

const SummaryCompletion: React.FC<Props> = ({
  id,
  question,
  range,
  questionRange,
  options,
  onAnswerChange,
}) => {
  const storageKey = `question-sumc-${id}`;
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
      <h1 className="bg-gray-100 font-medium mb-3">
        Complete each summary with the correct ending{" "}
        <span className="font-bold text-[#407db9]">{range}</span>. <br />
        <span>
          Write the correct letter. <span className="font-bold text-[#407db9] ">{range}</span>,
          in boxes <span className="font-bold text-[#407db9]">{questionRange}</span> on your
          answer sheet.
        </span>
      </h1>
      <p className="font-semibold mb-2 flex items-center gap-2"><span className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full text-lg font-bold flex-shrink-0">{id}</span>{question}</p>
      <input
        type="text"
        className="border rounded px-2 py-1 w-full hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
        value={answer}
        onChange={handleChange}
        placeholder="Your answer"
      />
      <div>
        <h1>
          
        </h1>
      </div>
     
    </div>
  );
};

export default SummaryCompletion;
