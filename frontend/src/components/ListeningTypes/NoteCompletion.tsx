"use client";
import React, { useEffect, useState } from "react";
import { ListeningQuestion } from "@/types/listening";

interface Props {
  sectionId: string; // GUID
  sectionTitle: string;
  instruction: string;
  wordLimit: string;
  questions: ListeningQuestion[];
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningNoteCompletion: React.FC<Props> = ({
  sectionId,
  sectionTitle,
  instruction,
  wordLimit,
  questions,
  onAnswerChange,
}) => {
  // Key: GUID câu hỏi, Value: text đáp án
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-note-${sectionId}`;
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
        } catch (e) { console.error(e); }
      }
    }
  }, [sectionId]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    localStorage.setItem(`listening-note-${sectionId}`, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-4">
        {sectionTitle && (
          <h3 className="text-lg font-bold text-gray-800 mb-1">{sectionTitle}</h3>
        )}
        <p className="text-gray-600 mb-2 text-sm">{instruction}</p>
        <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
          {wordLimit}
        </p>
      </div>

      {/* Notes List */}
      <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
        {questions.map((q) => {
        
          return (
            <div key={q.id} className="flex items-start gap-3">
              {/* Badge Number */}
              <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0 mt-1">
                {q.questionNumber}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-800 leading-relaxed">{q.questionText}</span>
                  
                  <input
                    type="text"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="px-2 py-1 border-b-2 border-gray-400 focus:border-blue-600 bg-transparent outline-none min-w-[120px] text-blue-800 font-semibold text-sm transition-colors focus:bg-white"
                    placeholder="..."
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListeningNoteCompletion;