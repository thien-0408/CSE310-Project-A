"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ListeningQuestion, ListeningOption } from "@/types/listening"; // Import type mới

interface Props {
  sectionId: string; // GUID
  title: string;
  instruction: string;
  mapImageUrl?: string | null; // Cho phép null
  options?: ListeningOption[]; // Tùy chọn A, B, C... để kéo thả hoặc chọn (nếu có)
  questions: ListeningQuestion[];
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningMapLabeling: React.FC<Props> = ({
  sectionId,
  title,
  instruction,
  mapImageUrl,
  options,
  questions,
  onAnswerChange,
}) => {
  // Key: GUID câu hỏi, Value: Đáp án (VD: "A", "B" hoặc text)
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-map-${sectionId}`;
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
    
    localStorage.setItem(`listening-map-${sectionId}`, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 italic">{instruction}</p>
      </div>

      {/* Map Image Display */}
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-center">
        {mapImageUrl ? (
          <div className="relative w-full max-w-2xl h-[400px]">
             {/* Dùng fill để ảnh tự scale responsive */}
             <Image 
                src={mapImageUrl.startsWith("http") ? mapImageUrl : `http://localhost:5151${mapImageUrl}`}
                alt="Map Diagram"
                fill
                className="object-contain rounded"
             />
          </div>
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded bg-white">
            <span className="font-medium">No Map Image Available</span>
          </div>
        )}
      </div>

      {/* Options List (Nếu có - VD: Matching places from a box) */}
      {options && options.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="font-bold text-blue-800 mb-3 text-sm uppercase">Options Box</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {options.map((opt) => (
              <div key={opt.id} className="flex items-start gap-2 bg-white px-2 py-1 rounded border border-blue-200 shadow-sm">
                <span className="font-bold text-blue-600">{opt.key}</span>
                <span className="text-sm text-gray-700 line-clamp-1" title={opt.text}>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
            
            {/* Badge Number */}
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
              {q.questionNumber}
            </div>
            
            {/* Input / Dropdown */}
            {options && options.length > 0 ? (
               // Nếu có options box -> Dùng dropdown
               <select
                 value={answers[q.id] || ""}
                 onChange={(e) => handleChange(q.id, e.target.value)}
                 className="px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 cursor-pointer"
               >
                 <option value="">Select</option>
                 {options.map((opt) => (
                   <option key={opt.id} value={opt.key}>{opt.key}</option>
                 ))}
               </select>
            ) : (
               // Nếu không có options -> Dùng Text Input
               <input 
                 type="text"
                 value={answers[q.id] || ""}
                 onChange={(e) => handleChange(q.id, e.target.value)}
                 className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                 placeholder="Answer..."
               />
            )}
            
            {/* Question Text */}
            <span className="text-gray-800 font-medium flex-1">{q.questionText}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningMapLabeling;