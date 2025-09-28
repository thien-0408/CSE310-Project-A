'use client';
import React, { useEffect, useState } from "react";

interface Blank {
  index: number;
  answer: string; // đáp án đúng (dùng cho scoring)
}

interface Props {
  id: number;
  question: string;
  text: string;
  blanks: Blank[];
  wordLimit?: string;
  onAnswerChange?: (answers: Record<number, string>) => void;
}

const GapFilling: React.FC<Props> = ({
  id,
  question,
  text,
  blanks,
  wordLimit,
  onAnswerChange,
}) => {
  const storageKey = `question-gap-${id}`;
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      if (onAnswerChange) onAnswerChange(parsed);
    }
  }, [storageKey]);

  const handleChange = (index: number, value: string) => {
    const updated = { ...answers, [index]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (onAnswerChange) onAnswerChange(updated);
  };

  // Render text có input box thay cho ___x___
  const renderWithBlanks = () => {
    let rendered = text;
    blanks.forEach((blank) => {
      const inputBox = `<input data-blank="${blank.index}" />`;
      rendered = rendered.replace(`___${blank.index}___`, inputBox);
    });
    return rendered;
  };

  return (
    <div className="p-4 mb-4">
      <h2 className="font-bold mb-2">
        {id}. {question}
      </h2>
      {wordLimit && (
        <p className="font-bold mb-3">Write <span className="font-bold text-[#407db9]">{wordLimit}</span>.</p>
      )}

      {/* Render với input */}
      <p className="leading-relaxed">
        {text.split(/(___\d+___)/g).map((part, i) => {
          const match = part.match(/___(\d+)___/);
          if (match) {
            const idx = parseInt(match[1], 10);
            return (
              <input
                key={i}
                type="text"
                value={answers[idx] || ""}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="border-b border-gray-500 px-2 mx-1 w-32 focus:outline-none"
                placeholder={`[${idx}]`}
              />
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    </div>
  );
};

export default GapFilling;
