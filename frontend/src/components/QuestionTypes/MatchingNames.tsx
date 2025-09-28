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
      <p className="font-semibold mb-3">{id}. {question}</p>
      <ul className="space-y-3">
        {statements.map((s) => (
          <li key={s.statementId} className="flex items-center gap-4">
            <span className="w-1/2 ">{s.text}</span>
            <select
              className="border rounded px-2 py-1"
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
