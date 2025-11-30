"use client";
import React, { useEffect, useState } from "react";
import { ReadingQuestion } from "@/types/ReadingInterfaces";

interface Props {
  id: string;
  question: string;
  text: string;
  questions?: ReadingQuestion[];
  blanks?: unknown[];
  wordLimit?: string;
  onAnswerChange?: (answers: Record<string, string>) => void;
}

const GapFilling: React.FC<Props> = ({
  id,
  question,
  text,
  questions,
  wordLimit,
  onAnswerChange,
}) => {
  const storageKey = `section-gap-${id}`;
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          if (onAnswerChange) onAnswerChange(parsed);
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
    if (onAnswerChange) onAnswerChange(updated);
  };

  const getQuestionIdByNumber = (num: number): string | undefined => {
    if (questions) {
      const q = questions.find((x) => x.questionNumber === num);
      return q?.id;
    }
    return undefined;
  };

  const splitRegex = /(___?\d+___?)/g;
  const matchRegex = /___?(\d+)___?/;

  return (
    <div className="p-6 mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Instructions */}
      {question && <h3 className="font-bold text-gray-800 mb-2">{question}</h3>}

      {wordLimit && (
        <p className="text-sm text-red-500 mb-4 italic font-medium border-l-2 border-red-500 pl-2">
          {wordLimit}
        </p>
      )}

      {/* Paragraph Content */}
      <div className="leading-8 text-gray-800 text-base text-justify">
        {text.split(splitRegex).map((part, i) => {
          const match = part.match(matchRegex);

          if (match) {
            const questionNumber = parseInt(match[1], 10);
            const questionId = getQuestionIdByNumber(questionNumber);

            if (questionId) {
              return (
                <span
                  key={i}
                  className="inline-flex items-center mx-1 align-middle"
                >
                  {/* Badge số thứ tự */}
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold mr-1 shadow-sm">
                    {questionNumber}
                  </span>
                  <input
                    type="text"
                    value={answers[questionId] || ""}
                    onChange={(e) => handleChange(questionId, e.target.value)}
                    className="font-semibold border-b-2 border-gray-300 bg-blue-50 px-2 py-0.5 w-32 text-center text-blue-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all rounded-t-sm"
                    autoComplete="off"
                    placeholder="..."
                  />
                </span>
              );
            }
            return (
              <span key={i} className="text-red-500 font-bold mx-1">
                [Error Q{questionNumber}]
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    </div>
  );
};

export default GapFilling;
