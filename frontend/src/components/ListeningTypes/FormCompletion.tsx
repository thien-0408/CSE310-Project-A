"use client";
import React, { useEffect, useState } from "react";
import { ListeningQuestion } from "@/types/listening";

interface Props {
  id: string; // Section GUID
  title: string;
  instruction: string;
  wordLimit: string;
  questions: ListeningQuestion[]; // Danh sách câu hỏi/trường của form
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const FormCompletion: React.FC<Props> = ({
  id,
  title,
  instruction,
  wordLimit,
  questions,
  onAnswerChange,
}) => {
  // Key: GUID, Value: Answer Text
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-form-${id}`;
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
  }, [id]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    localStorage.setItem(`listening-form-${id}`, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm font-medium text-gray-600 mb-2">{instruction}</p>
        <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
          {wordLimit}
        </p>
      </div>

      {/* Form Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {questions.map((field, index) => (
              <tr 
                key={field.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {/* Label Column (VD: "Name:", "Address:") */}
                <td className="px-4 py-3 font-medium text-gray-700 w-1/3 border-r border-gray-300 align-middle">
                  {field.label || field.questionText}
                </td>
                
                {/* Input / Value Column */}
                <td className="px-4 py-3 align-middle">
                  {field.isInput ? (
                    <div className="flex items-center gap-3">
                      {/* Badge Number */}
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">
                        {field.questionNumber}
                      </span>
                      
                      {/* Input Field */}
                      <input
                        type="text"
                        value={answers[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
                        placeholder="Type answer..."
                        autoComplete="off"
                      />
                    </div>
                  ) : (
                    // Static Value (VD: "John Smith")
                    <span className="text-gray-900 font-semibold">{field.value}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormCompletion;