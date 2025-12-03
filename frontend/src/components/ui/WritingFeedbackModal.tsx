"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, FileText, MessageSquare, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SubmissionDetail {
  id: string;
  testTitle: string;
  topic: string;
  testImage?: string;
  studentName: string;
  content: string;
  wordCount: number;
  submittedDate: string;
  hasResult: boolean;
  overallScore: number;
  generalFeedback?: string;
  grammarFeedback?: string;
  vocabularyFeedback?: string;
  gradedDate?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SubmissionDetail | null;
  loading?: boolean;
}

const WritingFeedbackModal: React.FC<Props> = ({ isOpen, onClose, data, loading }) => {
  // 1. State để kiểm tra Client-side rendering (tránh lỗi Hydration)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose} 
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-slate-50/50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
              {loading ? "Loading..." : data?.testTitle}
            </h2>
            {!loading && data && (
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {data.studentName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {new Date(data.gradedDate || data.submittedDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : data ? (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* LEFT: Result & Feedback */}
            <div className="w-full md:w-1/3 bg-blue-50/30 border-r border-gray-100 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Score Badge */}
              <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Overall Band Score</p>
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-blue-600">{data.overallScore}</span>
                  <span className="text-gray-400 text-lg">/9.0</span>
                </div>
              </div>

              {/* Feedbacks */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" /> Instructor Feedback
                </h3>
                
                {data.generalFeedback && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
                    <span className="block font-semibold text-gray-900 mb-1 text-xs uppercase">General</span>
                    {data.generalFeedback}
                  </div>
                )}
                
                {data.grammarFeedback && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
                    <span className="block font-semibold text-gray-900 mb-1 text-xs uppercase">Grammar</span>
                    {data.grammarFeedback}
                  </div>
                )}

                {data.vocabularyFeedback && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
                    <span className="block font-semibold text-gray-900 mb-1 text-xs uppercase">Vocabulary</span>
                    {data.vocabularyFeedback}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Essay Content */}
            <div className="w-full md:w-2/3 overflow-y-auto p-6 md:p-8 bg-white custom-scrollbar">
              <div className="max-w-2xl mx-auto">
                {/* Topic */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Topic</span>
                  <p className="text-gray-800 font-medium whitespace-pre-line">{data.topic}</p>
                </div>

                {/* Essay */}
                <div className="prose prose-slate max-w-none">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase mb-4">
                    <FileText className="w-4 h-4" /> Your Response ({data.wordCount} words)
                  </h3>
                  <div className="text-lg leading-relaxed text-gray-800 font-serif whitespace-pre-wrap p-4 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                    {data.content}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-red-500">Failed to load data</div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end flex-shrink-0">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default WritingFeedbackModal;