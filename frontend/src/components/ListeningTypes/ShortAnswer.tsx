'use client';
import React, { useEffect, useState } from "react";

interface Question {
  id: number;
  text: string;
  answer: string;
  wordLimit?: string;
  audioTimestamp?: string;
}

interface Props {
  sectionId: number;
  instruction: string;
  wordLimit: string;
  questions: Question[];
  onAnswerChange?: (sectionId: number, questionId: number, answer: string) => void;
}

const ListeningShortAnswer: React.FC<Props> = ({
  sectionId,
  instruction,
  wordLimit,
  questions,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load từ localStorage
  useEffect(() => {
    const storageKey = `listening-short-answer-${sectionId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      // Notify parent of loaded answers
      Object.entries(parsed).forEach(([qId, answer]) => {
        if (onAnswerChange) {
          onAnswerChange(sectionId, parseInt(qId), answer as string);
        }
      });
    }
  }, [sectionId]);

  const handleChange = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    const storageKey = `listening-short-answer-${sectionId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(sectionId, questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
      {/* Instructions */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">{instruction}</p>
        <p className="text-sm font-medium">
          Fill in the blanks with{" "}
          <span className="text-red-600 font-bold">{wordLimit}</span> for each answer.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="flex items-start gap-3">
            {/* Question number badge */}
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold flex-shrink-0 mt-1">
              {question.id}
            </div>
            
            {/* Question text and input */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-800">{question.text}</span>
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className="flex-1 min-w-[200px] px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Type your answer..."
                />
              </div>
              {question.wordLimit && (
                <p className="text-xs text-gray-500 mt-1">
                  Word limit: {question.wordLimit}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningShortAnswer;