"use client";
import React, { useEffect, useState } from "react";

// Structure câu hỏi từ API
interface QuestionItem {
  id: string; // GUID
  questionNumber: number;
  questionText: string;
  wordLimit?: string | null;
}

interface Props {
  sectionId: string; // GUID
  instruction: string;
  questions: QuestionItem[];
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningShortAnswer: React.FC<Props> = ({
  sectionId,
  instruction,
  questions,
  onAnswerChange,
}) => {
  // Store answers by Question GUID
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-short-answer-${sectionId}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          // Sync lên parent
          Object.entries(parsed).forEach(([qId, val]) => {
            if (onAnswerChange) onAnswerChange(qId, val as string);
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [sectionId]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    // Save all answers for this section
    localStorage.setItem(`listening-short-answer-${sectionId}`, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Instructions Header */}
      <div className="mb-6 border-b pb-4">
        <p className="text-gray-700 font-medium italic">{instruction}</p>
      </div>

      {/* List of Short Answer Questions */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
            
            {/* Question Label */}
            <div className="flex items-center gap-3 min-w-[300px]">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                {q.questionNumber}
              </div>
              <span className="text-gray-800 font-medium">{q.questionText}</span>
            </div>
            
            {/* Input Field */}
            <div className="flex-1">
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="Type your answer here..."
                autoComplete="off"
              />
              {q.wordLimit && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  *Limit: {q.wordLimit}
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