"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ListeningQuestion, ListeningOption } from "@/types/listening";

interface Props {
  sectionId: string; // GUID
  title: string;
  instruction: string;
  mapImageUrl?: string | null; // Diagram có thể là ảnh
  options?: ListeningOption[]; 
  questions: ListeningQuestion[]; // Danh sách các bước/câu hỏi trong diagram
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningDiagramLabeling: React.FC<Props> = ({
  sectionId,
  title,
  instruction,
  mapImageUrl,
  options,
  questions,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-diagram-${sectionId}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
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
    
    localStorage.setItem(`listening-diagram-${sectionId}`, JSON.stringify(updated));
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{instruction}</p>
      </div>

      {/* Optional: Diagram Image */}
      {mapImageUrl && (
         <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-xl h-64 border border-gray-100 rounded">
               <Image 
                  src={mapImageUrl.startsWith("http") ? mapImageUrl : `http://localhost:5151${mapImageUrl}`}
                  alt="Diagram"
                  fill
                  className="object-contain"
               />
            </div>
         </div>
      )}

      {/* Options Box (If matching) */}
      {options && options.length > 0 && (
        <div className="mb-8 mx-auto max-w-3xl bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2 bg-white px-2 py-1.5 rounded border border-blue-100 shadow-sm">
                <span className="font-bold text-blue-700 bg-blue-100 px-1.5 rounded text-xs">{option.key}</span>
                <span className="text-sm text-gray-700 truncate" title={option.text}>{option.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flowchart Layout */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto">
        <div className="space-y-2 relative">
          
          {/* Vertical Line Connector (Background) */}
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-300 z-0 hidden sm:block"></div>

          {questions.map((q, index) => (
            <div key={q.id} className="relative z-10">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-blue-300">
                
                {/* Number */}
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0 shadow-md">
                  {q.questionNumber}
                </div>
                
                {/* Content */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-gray-800 font-medium">{q.questionText}</span>
                    
                    {/* Input Area */}
                    <div className="flex-1 min-w-[150px]">
                      {options && options.length > 0 ? (
                        <select
                          value={answers[q.id] || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                        >
                          <option value="">Select...</option>
                          {options.map((opt) => (
                            <option key={opt.id} value={opt.key}>{opt.key}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={answers[q.id] || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none px-2 py-1 text-blue-800 font-semibold bg-transparent transition-colors"
                          placeholder="Answer..."
                        />
                      )}
                    </div>
                  </div>
                  
                  {q.wordLimit && (
                    <p className="text-[10px] text-red-500 mt-1 uppercase font-bold tracking-wide">
                      {q.wordLimit}
                    </p>
                  )}
                </div>
              </div>

              {/* Arrow Down Icon (between steps) */}
              {index < questions.length - 1 && (
                <div className="flex justify-start sm:pl-[18px] py-2 text-gray-400">
                  <span className="text-xl">↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListeningDiagramLabeling;