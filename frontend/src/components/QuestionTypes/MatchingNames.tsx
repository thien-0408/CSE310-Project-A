"use client";
import React, { useState, useEffect } from "react";

interface QuestionItem {
  id: number;       
  question: string; 
}

interface MatchingNamesProps {
  id: number;           
  instructions: string; 
  questions: QuestionItem[]; 
  options: string[];    
  onAnswerChange: (answers: Record<number, string>) => void;
}

const MatchingNames: React.FC<MatchingNamesProps> = ({
  id,
  instructions,
  questions,
  options,
  onAnswerChange,
}) => {
  const storageKey = `section-matching-${id}`;
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load saved answers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        onAnswerChange(parsed);
      } catch (e) {
        console.error("Error parsing saved answers", e);
      }
    }
  }, []);

  const handleChange = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    onAnswerChange(updated);
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-xl  ">
      {/* Options Box (List of Names) */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          List of People
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-800 bg-white px-3 py-2 shadow-sm rounded-2xl">
              {/* Giả sử option string là "A. David...", ta bôi đậm chữ cái đầu */}
              <span className="font-bold text-blue-600 min-w-[20px]">
                {opt.split(".")[0]}
              </span>
              <span className="text-sm">{opt.substring(opt.indexOf(".") + 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
            
            {/* Question Text with ID */}
            <div className="flex gap-3 flex-1">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-md font-bold flex-shrink-0 border border-gray-200">
                {q.id}
              </span>
              <p className="text-gray-700 text-base pt-1">
                {q.question}
              </p>
            </div>

            {/* Answer Select Dropdown */}
            <div className="w-full sm:w-48 flex-shrink-0 pl-11 sm:pl-0">
              <select
                className="w-full cursor-pointer border rounded-md p-2 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                <option  value="" disabled>Select answer...</option>
                {options.map((opt, idx) => {
                  return (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingNames;