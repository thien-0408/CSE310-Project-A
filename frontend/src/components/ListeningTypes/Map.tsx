"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ListeningQuestion, ListeningOption } from "@/types/listening";

interface Props {
  sectionId: string; // GUID
  title: string;
  instruction: string;
  mapImageUrl?: string | null;
  options?: ListeningOption[]; // Tùy chọn A, B, C...
  questions: ListeningQuestion[];
  onAnswerChange?: (questionId: string, answer: string) => void;
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
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const storageKey = `listening-map-${sectionId}`;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          Object.entries(parsed).forEach(([qId, val]) => {
            if (onAnswerChange) onAnswerChange(qId, val as string);
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const handleChange = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(`listening-map-${sectionId}`, JSON.stringify(updated));
    if (onAnswerChange) {
      onAnswerChange(questionId, value);
    }
  };

  return (
    <div className="mb-8 w-full max-w-5xl mx-auto">
      {/* --- HEADER: Technical Box Style --- */}
      <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">
            {title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed italic max-w-3xl">
            {instruction || "Label the map below. Choose the correct letter, A, B, C, etc."}
          </p>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-6">
        
        {/* --- MAP IMAGE CONTAINER --- */}
        <div className="mb-8 p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-inner flex justify-center">
          {mapImageUrl ? (
            <div className="relative w-full max-w-3xl h-[400px] md:h-[500px]">
              {/* Image Container with consistent aspect ratio handling */}
              <Image
                src={mapImageUrl.startsWith("http") ? mapImageUrl : `http://localhost:5151${mapImageUrl}`}
                alt="Map Diagram"
                fill
                className="object-contain rounded-md mix-blend-multiply" 
                // mix-blend-multiply giúp ảnh hòa trộn tốt hơn nếu nền ảnh không trong suốt hoàn toàn
              />
            </div>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-sm">No Map Image Available</span>
            </div>
          )}
        </div>

        {/* --- OPTIONS BOX (Reference List) --- */}
        {options && options.length > 0 && (
          <div className="bg-slate-50/50 rounded-lg border border-slate-300 mb-8">
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                List of Places / Options
              </h4>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {options.map((opt) => (
                  <div key={opt.id || opt.key} className="flex items-start gap-2.5 group">
                    <span className="font-serif font-bold text-indigo-700 min-w-[20px] select-none text-sm pt-0.5">
                      {opt.key}
                    </span>
                    <span className="text-slate-700 text-sm font-medium leading-snug group-hover:text-slate-900 transition-colors line-clamp-2" title={opt.text}>
                      {opt.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- QUESTIONS LIST --- */}
        <div className="space-y-3 max-w-3xl mx-auto md:mx-0">
          {questions.map((q) => {
             const currentValue = answers[q.id] || "";
             
             return (
              <div key={q.id} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                
                {/* Badge Number */}
                <div className="flex-shrink-0">
                  <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all">
                    {q.questionNumber}
                  </span>
                </div>
                
                {/* Input Area */}
                <div className="flex-shrink-0">
                  {options && options.length > 0 ? (
                    // Dropdown Select (nếu có options)
                    <div className="relative">
                      <select
                        value={currentValue}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className={`appearance-none w-32 border rounded-md px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm
                          ${
                            currentValue
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/50"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                          }
                        `}
                      >
                        <option value="" disabled className="text-slate-400 font-normal">Select</option>
                        {options.map((opt) => (
                          <option key={opt.id || opt.key} value={opt.key}>{opt.key}</option>
                        ))}
                      </select>
                      {/* Arrow Icon */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  ) : (
                    // Text Input (nếu không có options - điền từ)
                    <input 
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className="w-48 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all"
                      placeholder="Answer..."
                      autoComplete="off"
                    />
                  )}
                </div>
                
                {/* Question Text */}
                <span className="text-slate-800 font-medium text-base flex-1 leading-snug">
                  {q.questionText}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListeningMapLabeling;