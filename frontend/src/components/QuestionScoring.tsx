"use client";
import React, { useMemo } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { ReadingSection, ReadingQuestion } from "@/types/reading";

// --- TYPE DEFINITIONS ---

type FlatQuestion = ReadingQuestion & {
  questionType: string;
  sectionId: number;
};

interface UserAnswer {
  questionId: number;
  answer: unknown; 
}

interface ScoringProps {
  sections: ReadingSection[];
  userAnswers: UserAnswer[]; 
  onClose?: () => void;
}

// --- HELPER FUNCTIONS ---

const normalizeText = (text: unknown): string => {
  if (typeof text !== "string") return "";
  
  return text.toLowerCase().trim().replace(/\s+/g, " ");
};

const renderAnswerContent = (content: unknown) => {
  if (content === null || content === undefined || content === "") {
    return <span className="text-gray-400 italic">No answer</span>;
  }
  if (Array.isArray(content)) return content.join(", ");
  if (typeof content === "object") return JSON.stringify(content);
  return String(content);
};

// --- MAIN COMPONENT ---

const QuestionScoring: React.FC<ScoringProps> = ({
  sections,
  userAnswers,
  onClose,
}) => {
  
  const results = useMemo(() => {
    const allQuestions: FlatQuestion[] = sections.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        questionType: section.questionType,
        sectionId: section.sectionId,
      }))
    );
    const answersMap = new Map(
      userAnswers.map((u) => [u.questionId, u.answer])
    );

    let totalScore = 0;

    const processedResults = allQuestions.map((question) => {
      const userAnsRaw = answersMap.get(question.id);
      const correctAnsRaw = question.answer;

      // Mặc định là sai
      let isCorrect = false;

      
      if (typeof correctAnsRaw === "string") {
         const normalizedUser = normalizeText(userAnsRaw);
         const normalizedCorrect = normalizeText(correctAnsRaw);
         isCorrect = normalizedUser === normalizedCorrect && normalizedUser !== "";
      }
      else if (Array.isArray(correctAnsRaw) && Array.isArray(userAnsRaw)) {
         isCorrect = 
            userAnsRaw.length === correctAnsRaw.length &&
            userAnsRaw.every((val) => correctAnsRaw.includes(val));
      }
      else {
         isCorrect = userAnsRaw == correctAnsRaw;
      }

      if (isCorrect) totalScore += 1;

      return {
        questionId: question.id,
        questionType: question.questionType,
        questionText: question.question, 
        userAnswer: userAnsRaw,
        correctAnswer: correctAnsRaw,
        isCorrect,
      };
    });

    return { 
        details: processedResults, 
        totalScore, 
        totalQuestions: allQuestions.length 
    };
  }, [sections, userAnswers]);

  // --- RENDER INTERFACE---

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] w-full max-w-4xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header: Tổng điểm */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-blue-600" /> 
            Test Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">Review your performance details below.</p>
        </div>
        <div className="text-right bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <span className={`block text-3xl font-extrabold ${
             (results.totalScore / results.totalQuestions) >= 0.5 ? "text-green-600" : "text-orange-500"
          }`}>
            {results.totalScore} <span className="text-gray-300 text-xl">/</span> {results.totalQuestions}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Score</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {results.details.map((item) => (
          <div
            key={item.questionId}
            className={`p-4 rounded-xl border-l-[6px] transition-all shadow-sm bg-white ${
              item.isCorrect
                ? "border-l-green-500 border-t border-r border-b border-green-100/50"
                : "border-l-red-500 border-t border-r border-b border-red-100/50"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon Status */}
              <div className="mt-1 flex-shrink-0">
                {item.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 fill-red-50" />
                )}
              </div>

              {/* Question Details */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    Question {item.questionId}
                    <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                        {item.questionType.replace(/_/g, " ")}
                    </span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Answer */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1 tracking-wider">Your Answer</span>
                    <div className={`text-sm font-semibold break-words ${item.isCorrect ? "text-green-700" : "text-red-600"}`}>
                      {renderAnswerContent(item.userAnswer)}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  {!item.isCorrect && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1 tracking-wider">Correct Answer</span>
                      <div className="text-sm font-semibold text-blue-800 break-words">
                        {renderAnswerContent(item.correctAnswer)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {results.details.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                No questions found to score.
            </div>
        )}
      </div>

      {/* Footer, close button */}
      {onClose && (
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-black hover:shadow-lg active:transform active:scale-95 transition-all duration-200"
          >
            Close Results
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionScoring;