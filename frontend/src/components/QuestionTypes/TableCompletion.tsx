"use client";
import React, { useState, useEffect } from "react";
import { ReadingQuestion } from "@/types/ReadingInterfaces";

interface TableData {
  columns: string[];
  rows: string[][];
}

interface Props {
  id: string; // Section ID (GUID)
  instructions: string;
  table: TableData;
  questions: ReadingQuestion[]; // Cần danh sách câu hỏi để map ID
  onAnswerChange: (answers: Record<string, string>) => void;
}

const TableCompletion: React.FC<Props> = ({
  id,
  instructions,
  table,
  questions,
  onAnswerChange,
}) => {
  const storageKey = `section-table-${id}`;
  // Key là GUID, Value là câu trả lời
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, [storageKey]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    onAnswerChange(updated);
  };

  const renderCellContent = (content: string) => {
    // Regex tìm placeholder dạng ___1___, ___12___
    const parts = content.split(/(___\d+___)/g);

    if (parts.length === 1) return content;

    return (
      <div className="flex items-center justify-center flex-wrap gap-1">
        {parts.map((part, index) => {
          const match = part.match(/___(\d+)___/);
          if (match) {
            const qNum = parseInt(match[1], 10);
            // Tìm câu hỏi có questionNumber tương ứng để lấy GUID
            const question = questions.find((q) => q.questionNumber === qNum);

            if (question) {
              return (
                <div key={index} className="flex mx-1 items-center gap-1">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                    {qNum}
                  </span>
                  <input
                    type="text"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    className="border-b-2 border-gray-300 bg-blue-50/50 px-2 py-0.5 w-32 text-center focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-blue-700 text-sm"
                    autoComplete="off"
                  />
                </div>
              );
            }
            return <span key={index} className="text-red-500 text-xs">[Q{qNum} Not Found]</span>;
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  if (!table) return null;

  return (
    <div className="p-6 mb-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-4">{instructions}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-50">
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
                    className="px-4 py-3 border-r border-gray-200 text-sm text-gray-700 last:border-r-0 align-middle"
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