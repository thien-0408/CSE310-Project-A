"use client";
import React, { useState, useEffect } from "react";
import { ReadingSection } from "@/types/ReadingInterfaces";

interface Props {
  section: ReadingSection;
  onAnswerChange?: (questionId: string, value: string) => void;
}

// ... (các import giữ nguyên)

const MatchingNames: React.FC<Props> = ({ section, onAnswerChange }) => {
  // 1. Tạo key storage
  // Sử dụng optional chaining để tránh lỗi nếu section null
  const sectionId = section?.sectionId || "unknown";
  const storageKey = `matching-names-${sectionId}`;

  // 2. State lưu đáp án (Bỏ state 'selected' gây lỗi chọn trùng)
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // 3. Load saved answers
  useEffect(() => {
    if (typeof window !== "undefined" && sectionId !== "unknown") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          
          // Chỉ đồng bộ lên cha một lần khi load xong
          if (onAnswerChange) {
            Object.entries(parsed).forEach(([qId, val]) => {
              onAnswerChange(qId, val as string);
            });
          }
        } catch (e) {
          console.error("Error parsing saved answers", e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]); 
  if (!section) return null;

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  const getLabel = (idx: number, key?: string | null) => {
    return key ? key : String.fromCharCode(65 + idx);
  };
  
  const nameOptions = section.sectionOptions || [];

  return (
    <div className="mb-6 bg-white">
      {/* Header & Instructions */}
      {section.sectionTitle && (
        <h3 className="font-bold text-lg text-gray-800 mb-2">
          {section.sectionTitle}
        </h3>
      )}
      {section.instructions && (
        <p className="text-gray-600 italic mb-4">{section.instructions}</p>
      )}
      
      {/* List of Options (Names) */}
      <div className="bg-slate-50 p-5 rounded-lg mb-8 border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide border-b border-slate-200 pb-2">
          List of Options
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
          {nameOptions.map((opt, index) => {
            const label = getLabel(index, opt.key);
            return (
              <div
                key={opt.id || index}
                className="flex items-start gap-3 text-sm"
              >
                <span className="font-bold text-blue-600 min-w-[20px]">
                  {label}
                </span>
                <span className="text-gray-800 leading-relaxed">
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-2">
        {section.questions.map((q) => {
          const currentValue = answers[q.id] || ""; 
          
          return (
            <div
              key={q.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
            >
              <div className="flex gap-3 flex-1">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold flex-shrink-0 shadow-sm">
                  {q.questionNumber}
                </span>
                <p className="text-gray-700 text-base pt-1 font-medium leading-relaxed">
                  {q.questionText}
                </p>
              </div>

              <div className="w-full sm:w-64 flex-shrink-0 pl-11 sm:pl-0">
                <select
                  value={currentValue} 
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={`border rounded px-3 py-2 text-sm font-semibold min-w-[130px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer
                    ${
                      currentValue
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 bg-white"
                    }
                  `}
                >
                  <option value="" disabled>
                    Select answer...
                  </option>
                  {nameOptions.map((opt, idx) => {
                    const label = getLabel(idx, opt.key);
                    const truncatedText =
                      opt.text.length > 30
                        ? opt.text.substring(0, 30) + "..."
                        : opt.text;
                    return (
                      <option key={opt.id || idx} value={label}>
                        {label}. {truncatedText}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchingNames;