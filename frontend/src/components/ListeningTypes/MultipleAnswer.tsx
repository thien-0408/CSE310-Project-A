'use client';
import React, { useEffect, useState } from "react";

interface Props {
  id: number;
  question: string;
  instruction?: string;
  options: string[];
  maxAnswers?: number; 
  onAnswerChange?: (answer: number[]) => void;
}

const ListeningMultipleAnswer: React.FC<Props> = ({
  id,
  question,
  instruction,
  options,
  maxAnswers = 2,
  onAnswerChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Load từ localStorage
  useEffect(() => {
    const storageKey = `listening-ma-${id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedOptions(parsed);
      if (onAnswerChange) onAnswerChange(parsed);
    }
  }, [id]);

  const handleToggle = (optionIndex: number) => {
    let updated: number[];
    
    if (selectedOptions.includes(optionIndex)) {
      // Uncheck
      updated = selectedOptions.filter(i => i !== optionIndex);
    } else {
      // Check - but respect max limit
      if (selectedOptions.length < maxAnswers) {
        updated = [...selectedOptions, optionIndex].sort((a, b) => a - b);
      } else {
        // Already at max, don't add more
        return;
      }
    }
    
    setSelectedOptions(updated);
    
    const storageKey = `listening-ma-${id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) onAnswerChange(updated);
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  const isMaxReached = selectedOptions.length >= maxAnswers;

  return (
    <div className="p-6 mb-4 bg-white border border-gray-200 rounded-lg">
      {instruction && (
        <p className="text-sm text-gray-600 mb-2">
          Mark <span className="font-bold">{maxAnswers === 2 ? 'TWO' : maxAnswers === 3 ? 'THREE' : maxAnswers}</span> letter{maxAnswers > 1 ? 's' : ''} that represent the correct answer.
        </p>
      )}
      
      <h4 className="font-bold text-gray-800 mb-4">
        {question}
      </h4>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(index);
          const isDisabled = !isSelected && isMaxReached;
          
          return (
            <label
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isDisabled
                  ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(index)}
                disabled={isDisabled}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className={`flex-1 ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                <span className="font-medium">{getOptionLetter(index)}.</span> {option}
              </span>
            </label>
          );
        })}
      </div>

      {/* Counter */}
      <div className="mt-3 text-sm text-gray-600">
        Selected: {selectedOptions.length} / {maxAnswers}
      </div>
    </div>
  );
};

export default ListeningMultipleAnswer;