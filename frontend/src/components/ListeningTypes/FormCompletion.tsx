'use client';
import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";

interface FormField {
  id: number;
  label: string;
  answer: string;
  wordLimit?: string;
  isInput: boolean; 
  audioTimestamp?: string;
}

interface Props {
  id: number;
  title: string;
  instruction: string;
  wordLimit: string;
  formFields: FormField[];
  onAnswerChange?: (answers: Record<number, string>) => void;
}

const FormCompletion: React.FC<Props> = ({
  id,
  title,
  instruction,
  wordLimit,
  formFields,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load từ localStorage
  useEffect(() => {
    const storageKey = `listening-form-${id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      if (onAnswerChange) onAnswerChange(parsed);
    }
  }, [id]);

  const handleChange = (fieldId: number, value: string) => {
    const updated = { ...answers, [fieldId]: value };
    setAnswers(updated);
    
    const storageKey = `listening-form-${id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) onAnswerChange(updated);
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm font-medium">
          Complete the following form with{" "}
          <span className="text-red-600 font-bold">{wordLimit}</span> for each answer.
        </p>
      </div>

      {/* Form Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {formFields.map((field, index) => (
              <tr 
                key={field.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-3 font-medium text-gray-700 w-1/3 border-r border-gray-300">
                  {field.label}
                </td>
                <td className="px-4 py-3">
                  {field.isInput ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold flex-shrink-0">
                        {field.id}
                      </span>
                      <input
                        type="text"
                        value={answers[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="Type your answer..."
                      />
                    </div>
                  ) : (
                    <span className="text-gray-800">{field.answer}</span>
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