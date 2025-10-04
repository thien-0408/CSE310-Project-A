'use client';
import React, { useEffect, useState } from "react";
import { Question } from "@/types/listening";

interface Props {
  sectionId: number;
  sectionTitle: string;
  instruction: string;
  wordLimit: string;
  questions: Question[];
  onAnswerChange?: (sectionId: number, questionId: number, answer: string) => void;
}

const ListeningNoteCompletion: React.FC<Props> = ({
  sectionId,
  sectionTitle,
  instruction,
  wordLimit,
  questions,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load từ localStorage
  useEffect(() => {
    const storageKey = `listening-note-${sectionId}`;
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

  const handleChange = (noteId: number, value: string) => {
    const updated = { ...answers, [noteId]: value };
    setAnswers(updated);
    
    const storageKey = `listening-note-${sectionId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(sectionId, noteId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="mb-4">
        {sectionTitle && (
          <h3 className="text-lg font-bold text-gray-800 mb-2">{sectionTitle}</h3>
        )}
        <p className="text-gray-700 mb-2">{instruction}</p>
        <p className="text-sm font-medium">
          Complete the notes by filling in the blanks with{" "}
          <span className="text-red-600 font-bold">{wordLimit}</span> for each answer.
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-300">
        {questions.map((question) => {
          // Split text by blank placeholder if exists
          const parts = question.text.split('___');
          
          return (
            <div key={question.id} className="flex items-start gap-2">
              <div className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full text-sm font-bold flex-shrink-0 mt-0.5">
                {question.id}
              </div>
              
              <div className="flex-1">
                {parts.length > 1 ? (
                  // Text has ___ placeholder
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-gray-800">{parts[0]}</span>
                    <input
                      type="text"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className="px-3 py-1 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-white min-w-[150px]"
                      placeholder="..."
                    />
                    {parts[1] && <span className="text-gray-800">{parts[1]}</span>}
                  </div>
                ) : (
                  // Text without placeholder - input at the end
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-800">{question.text}</span>
                    <input
                      type="text"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className="px-3 py-1 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-white min-w-[150px]"
                      placeholder="Type your answer..."
                    />
                  </div>
                )}
                
                {question.wordLimit && (
                  <p className="text-xs text-gray-500 mt-1">
                    {question.wordLimit}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListeningNoteCompletion;