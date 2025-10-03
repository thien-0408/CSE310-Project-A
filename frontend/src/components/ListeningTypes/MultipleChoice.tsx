'use client';
import React, { useEffect, useState } from "react";

interface Props {
  id: number;
  question:  string | undefined;
  options: string[];
  instructions?: string;
  onAnswerChange?: (answer: number | null) => void;
}

const ListeningMultipleChoice: React.FC<Props> = ({
  id,
  question,
  options,
  instructions,
  onAnswerChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Load từ localStorage
  useEffect(() => {
    const storageKey = `listening-mc-${id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = parseInt(saved);
      setSelectedOption(parsed);
      if (onAnswerChange) onAnswerChange(parsed);
    }
  }, [id]);

  const handleSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    const storageKey = `listening-mc-${id}`;
    localStorage.setItem(storageKey, optionIndex.toString());
    
    if (onAnswerChange) onAnswerChange(optionIndex);
  };

  // Convert index to letter (0 -> A, 1 -> B, etc.)
  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  return (
    
    <>
    <div className="p-6 mb-4 bg-white border border-gray-200 rounded-lg">
      <h4 className="font-bold text-gray-800 mb-4">
        {id}. {question}
      </h4>

      <div className="space-y-3">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`question-${id}`}
              checked={selectedOption === index}
              onChange={() => handleSelect(index)}
              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex-1 text-gray-700">
              <span className="font-medium">{getOptionLetter(index)}.</span> {option}
            </span>
          </label>
        ))}
      </div>
    </div>
    </>
  );
};

export default ListeningMultipleChoice;