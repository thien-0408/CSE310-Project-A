'use client';

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

  const handleChange = (index: number) => {
    setSelected(index);
    localStorage.setItem(storageKey, index.toString());
    if (onAnswerChange) {
      onAnswerChange(index);
    }
  };

  return (
    <div className="p-4 mb-2">
      <h1>
        Do the following statements agree with the views of the writer in
        Reading Passage? In boxes on your answer sheet, write.
      </h1>
      <div className="grid grid-cols-[1fr_2fr] p-4 bg-gray-100 rounded-sm my-4 tracking-tight">
        <div className="space-y-2">
          <h2 className="font-bold">TRUE.</h2>
          <h2 className="font-bold">FALSE.</h2>
          <h2 className="font-bold">NOT GIVEN.</h2>
        </div>

        <div className="space-y-2 font-medium">
          <p>If the statement agrees with the information</p>
          <p>If the statement contradicts the information</p>
          <p>If there is no information on this</p>
        </div>
      </div>
      <p className="font-semibold mb-2">
        {id}. {question}
      </p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <label key={i} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={`tfng${id}`}
              className="text-blue-500"
              checked={selected === i}
              onChange={() => handleChange(i)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TrueFalseNotGiven;
