"use client";
import React from "react";

interface MatchingNamesProps {
  id: number;
  question: string;
  statements: Array<{ statementId: number; text: string }>;
  options: string[];
  onAnswerChange: (answer: Record<number, string>) => void;
}

const MatchingNames: React.FC<MatchingNamesProps> = ({
  id,
  question,
  statements,
  options,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = React.useState<Record<number, string>>({});

  const handleChange = (statementId: number, value: string) => {
    const updated = { ...answers, [statementId]: value };
    setAnswers(updated);
    onAnswerChange(updated);
  };

  return (
    <div className="p-4">
      <p className="font-semibold mb-2 flex items-center gap-2"><span className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full text-lg font-bold flex-shrink-0">{id}</span>{question}</p>
      <ul className="space-y-3">
        {statements.map((s) => (
          <li key={s.statementId} className="flex items-center gap-4">
            <span className="w-1/2 ">{s.text}</span>
            <select
          className="border border-gray-300 rounded-md p-2 font-medium text-gray-700 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
              value={answers[s.statementId] || ""}
              onChange={(e) => handleChange(s.statementId, e.target.value)}
            >
              <option value=""></option>
              {options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchingNames;
