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
        <span className="font-bold">{range}</span>. <br />
        <span>
          Write the correct letter. <span className="font-bold">{range}</span>,
          in boxes <span className="font-bold">{questionRange}</span> on your
          answer sheet.
        </span>
      </h1>
      <p className="font-semibold mb-2">
        {id}. {question}
      </p>
      <input
        type="text"
        className="border rounded px-2 py-1 w-full"
        value={answer}
        onChange={handleChange}
        placeholder="Your answer"
      />
      <div>
        <h1>
          
        </h1>
      </div>
      {/*Options question type */}
      {/* <select name="" id="">
  <option value="">-- Select an option --</option>
  {options && options.map((opt, idx) => (
    <option key={idx} value={opt}>
      {opt}
    </option>
  ))}
</select> */}
    </div>
  );
};

export default SummaryCompletion;
