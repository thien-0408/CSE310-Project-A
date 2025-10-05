'use client';
import React, { useEffect, useState } from "react";
import { DiagramStep } from "@/types/listening";


interface Props {
  sectionId: number;
  title: string;
  instruction: string;
  wordLimit: string;
  options?: Array<{ key: string; text: string }>; // For matching from list
  steps: DiagramStep[];
  onAnswerChange?: (sectionId: number, questionId: number, answer: string) => void;
}

const ListeningDiagramLabeling: React.FC<Props> = ({
  sectionId,
  title,
  instruction,
  wordLimit,
  options,
  steps,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load từ localStorage
  useEffect(() => {
    const storageKey = `listening-diagram-${sectionId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
      Object.entries(parsed).forEach(([qId, answer]) => {
        if (onAnswerChange) {
          onAnswerChange(sectionId, parseInt(qId), answer as string);
        }
      });
    }
  }, [sectionId]);

  const handleChange = (stepId: number, value: string) => {
    const updated = { ...answers, [stepId]: value };
    setAnswers(updated);
    
    const storageKey = `listening-diagram-${sectionId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(sectionId, stepId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-700 mb-2">{instruction}</p>
        <p className="text-sm font-medium">
          Choose <span className="font-bold">FIVE</span> letters from{" "}
          <span className="text-red-600 font-bold">{wordLimit}</span>, next to questions.
        </p>
      </div>

      {/* Options List (if provided) */}
      {options && options.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {options.map((option) => (
              <div key={option.key} className="flex items-start gap-2">
                <span className="font-bold text-blue-700">{option.key}</span>
                <span className="text-gray-800">{option.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagram/Flowchart */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
        <h4 className="text-center font-bold text-gray-800 mb-6">{title}</h4>
        
        <div className="space-y-4 max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Question number */}
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full text-sm font-bold flex-shrink-0">
                    {step.id}
                  </div>
                  
                  {/* Text and input */}
                  <div className="flex-1">
                    {options ? (
                      // Dropdown for matching
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-800">{step.text}</span>
                        <select
                          value={answers[step.id] || ""}
                          onChange={(e) => handleChange(step.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          {options.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.key}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      // Text input
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-800">{step.text}</span>
                        <input
                          type="text"
                          value={answers[step.id] || ""}
                          onChange={(e) => handleChange(step.id, e.target.value)}
                          className="flex-1 min-w-[200px] px-3 py-2 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
                          placeholder="Type answer..."
                        />
                      </div>
                    )}
                    {step.wordLimit && (
                      <p className="text-xs text-gray-500 mt-1">{step.wordLimit}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="flex justify-baseline ml-8">
                  <div className="text-3xl text-gray-400">↓</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListeningDiagramLabeling;