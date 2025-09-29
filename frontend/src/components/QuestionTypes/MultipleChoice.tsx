'use client';
import React from "react";
import { useState, useEffect } from "react";

interface Props {
  id: number;
  question: string;
  options: string[];
  onAnswerChange?: (answer: number) => void; 
}

const MultipleChoice: React.FC<Props> = ({ id, question, options, onAnswerChange }) => {
  const storageKey = `question-${id}`;

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
      <p className="font-semibold mb-2">{id}. {question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <label key={i} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={`q${id}`}
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

export default MultipleChoice;