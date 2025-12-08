"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ListeningQuestion, ListeningOption } from "@/types/listening";
import { Info } from "lucide-react";

interface Props {
  sectionId: string; // GUID
  title: string;
  instruction: string;
  mapImageUrl?: string | null;
  options?: ListeningOption[]; 
  questions: ListeningQuestion[];
  onAnswerChange?: (questionId: string, answer: string) => void;
}

const ListeningDiagramLabeling: React.FC<Props> = ({
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
    const storageKey = `listening-diagram-${sectionId}`;
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
    
    localStorage.setItem(`listening-diagram-${sectionId}`, JSON.stringify(updated));
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
          <p className="text-slate-600 text-sm leading-relaxed italic max-w-3xl flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
            {instruction || "Label the diagram below."}
          </p>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm p-6">
        
        {/* --- DIAGRAM IMAGE --- */}
        {mapImageUrl && (
           <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-inner flex justify-center">
              <div className="relative w-full max-w-2xl h-64 md:h-80">
                 <Image 
                    src={mapImageUrl.startsWith("http") ? mapImageUrl : `http://localhost:5151${mapImageUrl}`}
                    alt="Diagram"
                    fill
                    className="object-contain mix-blend-multiply"
                 />
              </div>
           </div>
        )}

        {/* --- OPTIONS BOX (Reference List) --- */}
        {options && options.length > 0 && (
          <div className="bg-slate-50/50 rounded-lg border border-slate-300 mb-10 max-w-4xl mx-auto">
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                List of Parts / Options
              </h4>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {options.map((option) => (
                  <div key={option.id} className="flex items-start gap-3 group">
                    <span className="font-serif font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded text-sm min-w-[24px] text-center border border-indigo-100">
                      {option.key}
                    </span>
                    <span className="text-sm font-medium text-slate-700 leading-snug group-hover:text-slate-900 transition-colors" title={option.text}>
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- FLOWCHART / STEPS LAYOUT --- */}
        <div className="max-w-3xl mx-auto relative pl-4 sm:pl-0">
          
          {/* Vertical Connector Line */}
          <div className="absolute left-[27px] sm:left-[27px] top-6 bottom-6 w-0.5 bg-slate-200 z-0"></div>

          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="relative z-10">
                <div className="group bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-indigo-300 hover:shadow-md">
                  
                  {/* Badge Number */}
                  <div className="flex-shrink-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 transition-all shadow-sm">
                      {q.questionNumber}
                    </span>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="text-slate-800 font-medium text-[1.05rem] leading-snug flex-1">
                        {q.questionText}
                      </span>
                      
                      {/* Input Area */}
                      <div className="flex-shrink-0 w-full sm:w-auto min-w-[180px]">
                        {options && options.length > 0 ? (
                          // Dropdown
                          <div className="relative">
                            <select
                              value={answers[q.id] || ""}
                              onChange={(e) => handleChange(q.id, e.target.value)}
                              className="appearance-none w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-indigo-700 bg-white cursor-pointer shadow-sm transition-all hover:border-indigo-300"
                            >
                              <option value="" disabled className="text-slate-400 font-normal">Select...</option>
                              {options.map((opt) => (
                                <option key={opt.id} value={opt.key}>{opt.key}</option>
                              ))}
                            </select>
                            {/* Arrow Icon */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        ) : (
                          // Text Input (Underlined Style)
                          <div className="relative">
                            <input
                              type="text"
                              value={answers[q.id] || ""}
                              onChange={(e) => handleChange(q.id, e.target.value)}
                              className="w-full border-b-2 border-slate-300 bg-slate-50/50 px-3 py-1.5 text-indigo-800 font-bold focus:border-indigo-600 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 text-center rounded-t-sm"
                              placeholder="Answer..."
                              autoComplete="off"
                            />
                            {/* Focus Line */}
                            <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 w-0 transition-all duration-300 group-focus-within:w-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {q.wordLimit && (
                      <div className="mt-2 flex justify-end sm:justify-start">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">
                          {q.wordLimit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Down Icon (Connector) */}
                {index < questions.length - 1 && (
                  <div className="flex justify-start pl-[14px] sm:pl-[14px] py-1 relative z-10">
                    <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningDiagramLabeling;