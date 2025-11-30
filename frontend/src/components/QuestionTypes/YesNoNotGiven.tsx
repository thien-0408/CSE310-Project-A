"use client";
import React, { useState, useEffect } from "react";

interface Props {
  id: string;
  questionNumber: number; 
  question: string;
  options?: string[];
  onAnswerChange?: (questionId: string, value: string) => void;
}

const defaultOptions = ["Yes", "No", "Not Given"];

const YesNoNotGiven: React.FC<Props> = ({
  id,
  questionNumber,
  question,
  options = defaultOptions,
  onAnswerChange,
}) => {
  const storageKey = `question-ynng-${id}`;
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSelected(saved);
        // Đảm bảo cập nhật lại state cha khi load lại trang
        if (onAnswerChange) onAnswerChange(id, saved); 
      }
    }
  }, [id, storageKey]);

  const handleChange = (value: string) => {
    setSelected(value);
    localStorage.setItem(storageKey, value);
    if (onAnswerChange) onAnswerChange(id, value);
  };

  return (
    <div className="flex items-start gap-4 mb-4 p-3 bg-white rounded border border-gray-100 hover:border-gray-200 transition-colors">
      {/* Badge Số thứ tự */}
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm mt-1">
        {questionNumber}
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Dropdown chọn đáp án */}
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          className={`border rounded px-3 py-2 text-sm font-semibold min-w-[130px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer
            ${selected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700 bg-white"}
          `}
        >
          <option value="" disabled>Select Answer</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Nội dung câu hỏi */}
        <p className="text-gray-800 text-base leading-relaxed font-medium">
          {question}
        </p>
      </div>
    </div>
  );
};

export default YesNoNotGiven;