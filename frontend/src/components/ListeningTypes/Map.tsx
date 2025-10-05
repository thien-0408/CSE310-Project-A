'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Question } from "@/types/listening";

interface Props {
  sectionId: number;
  title: string;
  instruction: string;
  mapImageUrl?: string; // Optional: URL to map image
  options: Array<{ key: string; text: string }>; // A-I options
  questions: Question[];
  onAnswerChange?: (sectionId: number, questionId: number, answer: string) => void;
}

const ListeningMapLabeling: React.FC<Props> = ({
  sectionId,
  title,
  instruction,
  mapImageUrl,
  options,
  questions,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load từ localStorage
  useEffect(() => {
    const storageKey = `listening-map-${sectionId}`;
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

  const handleChange = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    
    const storageKey = `listening-map-${sectionId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (onAnswerChange) {
      onAnswerChange(sectionId, questionId, value);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-700 mb-2">{instruction}</p>
      </div>

      {/* Map Display */}
      <div className="mb-6 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
        {mapImageUrl ? (
          <Image 
            src={mapImageUrl} 
            alt="Map" 
            className="w-1/2 mx-auto rounded"
            width={100}
            height={100}
            quality={100}
          />
        ) : (
          <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded border-2 border-gray-400">
            <div className="text-center text-gray-500 mb-4">
              <p className="font-semibold text-lg">{title}</p>
              <p className="text-sm">Map visualization would appear here</p>
            </div>
            {/* Placeholder map representation */}
            <div className="relative h-64 bg-gray-50 rounded flex items-center justify-center">
              <span className="text-gray-400 text-sm">Map Image: {title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Options List */}
      {/* {options && options.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-gray-800 mb-3">Options:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {options.map((option) => (
              <div key={option.key} className="flex items-start gap-2">
                <span className="font-bold text-blue-700 min-w-[20px]">{option.key}</span>
                <span className="text-gray-800">{option.text}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((question) => (
          <div 
            key={question.id} 
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            {/* Question number */}
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full text-lg font-bold flex-shrink-0">
              {question.id}
            </div>
            
            {/* Dropdown */}
            <select
              value={answers[question.id] || ""}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 min-w-[100px]"
            >
              <option value="">Select</option>
              {options.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.key}
                </option>
              ))}
            </select>
            
            {/* Label */}
            <span className="text-gray-800 flex-1">{question.question}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningMapLabeling;