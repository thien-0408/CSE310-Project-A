'use client';
import React, { useState, useEffect } from "react";

interface Props {
  id: number;
  question: string;
  paragraphs: string[];
  headings: string[];
  options?: string[];
  onAnswerChange?: (answers: Record<string, string>) => void;
}

const MatchingHeadings: React.FC<Props> = ({ id, question, paragraphs, headings, options, onAnswerChange }) => {
  const storageKey = `question-mh-${id}`;
  const [selected, setSelected] = useState<Record<string, string>>({});

  // Load saved answers từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelected(parsed);
      if (onAnswerChange) onAnswerChange(parsed);
    }
  }, [storageKey]);

  const handleChange = (paragraph: string, value: string) => {
    const updated = { ...selected, [paragraph]: value };
    setSelected(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (onAnswerChange) onAnswerChange(updated);
  };

  return (
    <div className="p-4 mb-4">
      <h2 className="font-bold text-lg mb-2">
        {id}. {question}
      </h2>

      <p className="mb-3 font-medium">Choose the correct heading for each paragraph:</p>

      <div className="space-y-4">
        {paragraphs.map((para, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <span className="w-32 font-semibold">{para}</span>
            <select
              value={selected[para] || ""}
              onChange={(e) => handleChange(para, e.target.value)}
              className="flex-1 border rounded p-1"
            >
              <option value=""></option>
              {options?.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/*Heading list */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">List of Headings:</h3>
        <ul className="list-none list-inside text-gray-700">
          {headings.map((h, i) => (
            <li key={i} className="font-semibold  even:bg-gray-100 p-4" >{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchingHeadings;
