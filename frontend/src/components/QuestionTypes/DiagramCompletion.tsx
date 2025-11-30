"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ReadingQuestion } from "@/types/ReadingInterfaces";

interface Props {
  id: string; // Section ID (GUID)
  instructions: string;
  questions: ReadingQuestion[];
  image?: string;
  onAnswerChange: (answers: Record<string, string>) => void;
}

const DiagramCompletion: React.FC<Props> = ({
  id,
  instructions,
  questions,
  image,
  onAnswerChange,
}) => {
  const storageKey = `section-diagram-${id}`;
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, [storageKey]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    onAnswerChange(updated);
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-xl ">
      {/* Diagram Image (Optional) */}
      {image && (
        <div className="mb-8 flex justify-center bg-white p-4 border border-gray-100 rounded-lg">
          <Image
            src={image}
            alt="Diagram illustration"
            className="max-w-full h-auto max-h-[400px] object-contain"
            width={500} // Cần width/height mặc định cho next/image
            height={300}
          />
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((q) => {
            // Parse diagram labels nếu cần (hoặc parent đã parse sẵn và truyền qua prop khác)
            // Giả sử logic render flow ở đây dựa vào q.diagramLabelsJson hoặc logic cũ
            // Tạm thời map data từ q.diagramLabelsJson (nếu có) hoặc xử lý custom
            
            const diagramLabels = q.diagramLabelsJson ? JSON.parse(q.diagramLabelsJson) : [];
            // Nếu component cũ dùng prop 'diagram' array string, bạn cần đảm bảo data đã được convert trước khi truyền vào hoặc convert ngay tại đây.
            
            return (
              <div
                key={q.id}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative transition-all hover:border-blue-200"
              >
                {/* Question Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white border border-gray-200 rounded-full flex items-center justify-center font-bold shadow-sm z-10">
                  {q.questionNumber}
                </div>

                {/* Question Text */}
                {q.questionText && (
                  <p className="text-gray-700 font-medium mb-6 ml-2 pt-1">
                    {q.questionText}
                  </p>
                )}

                {/* Diagram Flow / Labels Render */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {diagramLabels?.map((label: string, index: number) => {
                    const isBlank = label.includes("____");

                    return (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <div className="text-gray-300 hidden sm:block">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </div>
                        )}

                        {/* Render Input hoặc Label */}
                        {isBlank ? (
                          <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                            <div className="relative">
                              <input
                                type="text"
                                value={answers[q.id] || ""}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                                className="border-2 border-blue-300 bg-white px-4 py-2 rounded-lg w-48 text-center text-blue-700 font-semibold placeholder-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                                placeholder="Type answer..."
                                autoComplete="off"
                              />
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white text-[10px] flex items-center justify-center rounded-full">
                                ?
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white border border-gray-300 px-5 py-2.5 rounded-lg shadow-sm text-gray-700 font-semibold min-w-[100px] text-center select-none">
                            {label}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default DiagramCompletion;