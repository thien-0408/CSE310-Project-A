"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Info } from "lucide-react"; // Cần cài lucide-react nếu chưa có

interface QuestionItem {
  id: string;
  questionNumber: number;
  questionText: string;
}

interface Props {
  title: string;
  instructions: string;
  wordLimit?: string;
  questions?: QuestionItem[];
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const SentenceCompletion: React.FC<Props> = ({
  title,
  instructions,
  questions = [],
  wordLimit,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const sectionKey = useMemo(() => {
    return questions.length > 0 ? `sec-sc-${questions[0].id}` : "";
  }, [questions]);

  // --- Logic giữ nguyên ---
  useEffect(() => {
    if (sectionKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(sectionKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          Object.entries(parsed).forEach(([qId, val]) => {
            if (onAnswerChange) {
              onAnswerChange(qId, val as string);
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  const handleChange = (qId: string, val: string) => {
    const updated = { ...answers, [qId]: val };
    setAnswers(updated);
    if (sectionKey) localStorage.setItem(sectionKey, JSON.stringify(updated));
    if (onAnswerChange) onAnswerChange(qId, val);
  };

  // --- Render Question Content (Style mới) ---
  const renderQuestionContent = (q: QuestionItem) => {
    if (!q.questionText)
      return <span className="text-red-500 italic text-sm">Question text unavailable</span>;

    const parts = q.questionText.split(/(__\d+__|_{2,})/g);
    const hasPlaceholder = parts.length > 1;

    // Style chung cho input: Giống giấy thi, tập trung vào nội dung
    const inputClass =
      "mx-2 min-w-[160px] border-b-2 border-slate-300 bg-slate-50 px-3 py-1 text-center font-medium text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400";

    if (!hasPlaceholder) {
      return (
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-slate-800 leading-loose text-[1.05rem]">{q.questionText}</span>
          <input
            type="text"
            className={inputClass}
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(q.id, e.target.value)}
            autoComplete="off"
            aria-label={`Answer for question ${q.questionNumber}`}
          />
        </div>
      );
    }

    return (
      <div className="text-slate-800 leading-[2.8rem] text-[1.05rem]">
        {parts.map((part, index) => {
          if (part.match(/(__\d+__|_{2,})/)) {
            return (
              <input
                key={index}
                type="text"
                className={inputClass}
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                autoComplete="off"
                placeholder={`Q${q.questionNumber}`} // Placeholder gọn gàng
              />
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 w-full max-w-5xl mx-auto">
      {/* --- HEADER: Professional Card Header style --- */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
             {/* Tiêu đề dùng font Serif (nếu có) hoặc Sans-serif đậm để tạo sự trang trọng */}
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              {title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
              {instructions}
            </p>
          </div>
          
          {/* Word Limit Badge: Nghiêm túc, cảnh báo rõ ràng */}
          {wordLimit && (
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs font-bold uppercase tracking-wide">
              <Info className="w-3.5 h-3.5" />
              {wordLimit}
            </div>
          )}
        </div>
      </div>

      {/* --- BODY: Question List --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm divide-y divide-slate-100">
        {questions.map((q) => (
          <div
            key={q.id}
            className="group flex items-start gap-4 p-5 hover:bg-slate-50/80 transition-colors duration-200"
          >
            {/* Question Number: Minimalist Box style */}
            <div className="flex-shrink-0 mt-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
                {q.questionNumber}
              </span>
            </div>
            
            {/* Question Content */}
            <div className="flex-1 pt-0.5">
              {renderQuestionContent(q)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentenceCompletion;