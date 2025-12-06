"use client";
import React, { useEffect, useState } from "react";
import { ListeningQuestion, ListeningOption } from "@/types/listening";

interface Props {
  sectionId: string; // GUID
  title: string;
  instruction: string;
  options: ListeningOption[]; // Các lựa chọn trong Box (A, B, C...)
  questions: ListeningQuestion[]; // Các câu hỏi (1, 2, 3...)
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const MatchingInformation: React.FC<Props> = ({
  sectionId,
  title,
  instruction,
  options,
  questions,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-matching-${sectionId}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          Object.entries(parsed).forEach(([qId, val]) => {
            if (onAnswerChange) onAnswerChange(qId, val as string);
          });
        } catch (e) { console.error(e); }
      }
    }
  }, [sectionId]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    localStorage.setItem(`listening-matching-${sectionId}`, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 italic text-sm">{instruction}</p>
      </div>

      {/* Options Box (List A, B, C) */}
      {options && options.length > 0 && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="font-bold text-blue-900 mb-3 text-xs uppercase tracking-wide">Options Box</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
            {options.map((option) => (
              <div key={option.id} className="flex items-start gap-2 text-sm">
                <span className="font-bold text-blue-700 min-w-[20px]">{option.key}</span>
                <span className="text-gray-700">{option.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((question) => (
          <div 
            key={question.id} 
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            {/* Question Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0 shadow-sm">
                {question.questionNumber}
              </div>
              <span className="text-gray-800 font-medium">{question.questionText}</span>
            </div>
            
            {/* Dropdown Selection */}
            <div className="sm:w-48 pl-11 sm:pl-0">
              <select
                value={answers[question.id] || ""}
                onChange={(e) => handleChange(question.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm cursor-pointer shadow-sm"
              >
                <option value="">Select option...</option>
                {options.map((opt) => (
                  <option key={opt.id} value={opt.key}>
                    {opt.key}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingInformation;