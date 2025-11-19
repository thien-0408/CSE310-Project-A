"use client";
import React, { useState, useEffect } from "react";

interface TableData {
  columns: string[];
  rows: string[][];
}

interface Props {
  id: number;
  instructions: string;
  table: TableData;
  onAnswerChange: (answers: Record<number, string>) => void;
}

const TableCompletion: React.FC<Props> = ({
  id,
  instructions,
  table,
  onAnswerChange,
}) => {
  const storageKey = `section-table-${id}`;
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load saved answers
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        onAnswerChange(parsed);
      } catch (e) {
        console.error("Error parsing saved answers", e);
      }
    }
  }, []);

  const handleChange = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    onAnswerChange(updated);
  };

  const renderCellContent = (content: string) => {
    const parts = content.split(/(___\d+___)/g);

    if (parts.length === 1) return content;

    return (
      <div className="flex items-center justify-center flex-wrap gap-1">
        {parts.map((part, index) => {
          const match = part.match(/___(\d+)___/);
          if (match) {
            const questionId = parseInt(match[1], 10);
            return (
              <div key={index} className="relative inline-block mx-1">
                {/* Badge ID nhỏ phía trên */}
                <span className=" left-0  justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                  {questionId}
                </span>
                <input
                  type="text"
                  value={answers[questionId] || ""}
                  onChange={(e) => handleChange(questionId, e.target.value)}
                  className="border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 w-32 text-center text-sm font-medium text-gray-700 outline-none transition-all"
                  autoComplete="off"
                />
              </div>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };
  if (!table) return null;

  return (
    <div className="p-6 mb-6 bg-white rounded-xl ">
      {/* Render Table  */}
      <div className="">
        <table className="w-full min-w-[600px] border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {table.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 border-b border-r border-gray-200 text-left text-sm font-bold text-gray-700 uppercase tracking-wider last:border-r-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors">
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-4 py-3 border-r border-gray-200 text-sm text-gray-700 last:border-r-0"
                  >
                    {renderCellContent(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCompletion;
