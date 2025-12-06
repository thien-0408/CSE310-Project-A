"use client";
import React, { useEffect, useState } from "react";
// Import type ListeningOption để dùng cho options
import { ListeningOption } from "@/types/listening";

interface Props {
  id: string; // GUID câu hỏi
  question: string;
  instruction?: string;
  options: ListeningOption[]; // Mảng option từ API {id, key, text}
  maxAnswers?: number; 
  onAnswerChange?: (questionId: string, answer: string[]) => void;
}

const ListeningMultipleAnswer: React.FC<Props> = ({
  id,
  question,
  instruction,
  options,
  maxAnswers = 2,
  onAnswerChange,
}) => {
  // Lưu mảng các Key được chọn (VD: ["A", "C"])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const storageKey = `listening-ma-${id}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSelectedKeys(parsed);
          if (onAnswerChange) onAnswerChange(id, parsed);
        } catch (e) { console.error(e); }
      }
    }
  }, [id]);

  const handleToggle = (key: string) => {
    let updated: string[];
    
    if (selectedKeys.includes(key)) {
      // Uncheck
      updated = selectedKeys.filter(k => k !== key);
    } else {
      // Check (kiểm tra max limit)
      if (selectedKeys.length < maxAnswers) {
        updated = [...selectedKeys, key].sort(); // Sort A, B, C cho đẹp
      } else {
        return; // Đã đủ số lượng
      }
    }
    
    setSelectedKeys(updated);
    localStorage.setItem(`listening-ma-${id}`, JSON.stringify(updated));
    
    if (onAnswerChange) onAnswerChange(id, updated);
  };

  const isMaxReached = selectedKeys.length >= maxAnswers;

  return (
    <div className="p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {instruction && (
        <p className="text-sm text-gray-600 mb-2 italic">{instruction}</p>
      )}
      
      <h4 className="font-bold text-gray-800 mb-4">{question}</h4>

      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedKeys.includes(opt.key);
          const isDisabled = !isSelected && isMaxReached;
          
          return (
            <label
              key={opt.id} // Dùng GUID của option làm key react
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isDisabled
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(opt.key)}
                disabled={isDisabled}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className={`flex-1 ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                <span className="font-bold mr-2">{opt.key}.</span> {opt.text}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-gray-500 font-medium">
        Selected: {selectedKeys.length} / {maxAnswers}
      </div>
    </div>
  );
};

export default ListeningMultipleAnswer;