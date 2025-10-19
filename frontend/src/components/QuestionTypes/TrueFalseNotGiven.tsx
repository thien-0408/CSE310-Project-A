"use client";

import React, { useState, useEffect } from "react";

interface Props {
  id: number;
  question: string;
  options?: string[];
  onAnswerChange?: (answer: number) => void;
}

const defaultOptions = ["True", "False", "Not Given"];

const TrueFalseNotGiven: React.FC<Props> = ({
  id,
  question,
  options = defaultOptions,
  onAnswerChange,
}) => {
  const storageKey = `question-tfng-${id}`;
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      const savedIndex = parseInt(saved, 10);
      setSelected(savedIndex);
      if (onAnswerChange) {
        onAnswerChange(savedIndex);
      }
    }
  }, [storageKey]);

  const handleChange = (value: string) => {
    const index = parseInt(value, 10);
    setSelected(index);
    localStorage.setItem(storageKey, index.toString());
    if (onAnswerChange) {
      onAnswerChange(index);
    }
  };

  return (
    <div className="p-4 mb-2">
      <h1 className="font-medium text-gray-800">
        Do the following statements agree with the views of the writer in
        Reading Passage? In boxes on your answer sheet, write.
      </h1>
      <div className="grid grid-cols-[1fr_2fr] p-4 bg-gray-100 rounded-sm my-4 tracking-tight">
        <div className="space-y-2">
          <h2 className="font-bold text-[#407db9]">TRUE.</h2>
          <h2 className="font-bold text-[#407db9]">FALSE.</h2>
          <h2 className="font-bold text-[#407db9]">NOT GIVEN.</h2>
        </div>

        <div className="space-y-2 font-medium">
          <p>If the statement agrees with the information</p>
          <p>If the statement contradicts the information</p>
          <p>If there is no information on this</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="font-semibold mb-2 flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full text-lg font-bold flex-shrink-0">
            {id}
          </span>
        </p>
        <select
          value={selected !== null ? selected : ""}
          onChange={(e) => handleChange(e.target.value)}
          className="border border-gray-300 rounded-md p-2 font-medium text-gray-700 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        >
          <option value=""></option>
          {options.map((opt, i) => (
            <option key={i} value={i} className="text-left font-medium">
              {opt}
            </option>
          ))}
        </select>
        <p className="font-semibold">{question}</p>
      </div>
    </div>
  );
};

export default TrueFalseNotGiven;
