"use client";
import React, { useEffect, useState } from "react";

// Định nghĩa Type cho Option object từ API
interface ListeningOption {
  id?: string;
  key: string;  // "A", "B", "C"
  text: string; // Nội dung option
}

interface Props {
  id: string; // GUID
  questionNumber: number;
  question: string;
  options: ListeningOption[]; // <--- SỬA: Nhận mảng Object thay vì mảng String
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningMultipleChoice: React.FC<Props> = ({
  id,
  questionNumber,
  question,
  options,
  onAnswerChange,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Load saved answer từ LocalStorage
  useEffect(() => {
    const storageKey = `listening-mc-${id}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSelectedKey(saved);
        if (onAnswerChange) onAnswerChange(id, saved);
      }
    }
  }, [id]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    localStorage.setItem(`listening-mc-${id}`, key);
    if (onAnswerChange) onAnswerChange(id, key);
  };

  return (
    <div className="p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h4 className="font-bold text-gray-800 mb-4 flex gap-2">
        <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">
          {questionNumber}
        </span>
        <span>{question}</span>
      </h4>

      <div className="space-y-3">
        {options.map((opt) => (
          <label
            key={opt.key} // Dùng Key "A", "B" làm unique key cho React
            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedKey === opt.key
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`question-${id}`}
              checked={selectedKey === opt.key}
              onChange={() => handleSelect(opt.key)}
              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 shrink-0"
            />
            <span className="flex-1 text-gray-700 text-sm">
              <span className="font-bold mr-2">{opt.key}.</span> 
              {/* Render opt.text (string) thay vì opt (object) */}
              {opt.text} 
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ListeningMultipleChoice;