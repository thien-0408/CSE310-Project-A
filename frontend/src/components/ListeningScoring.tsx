"use client";
import React, { useMemo } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ListeningPart, UserAnswer } from "@/types/listening";

// --- TYPE DEFINITIONS ---
interface ScoreResultDetail {
  sectionId: string;
  questionId: string;
  questionNumber: number;
  questionType: string;
  questionText: string;
  userAnswer: unknown;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
}

interface ScoringProps {
  listeningData: ListeningPart;
  userAnswers?: UserAnswer[]; 
  onClose?: () => void;
}

// Helper Functions
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

const ListeningScoring: React.FC<ScoringProps> = ({
  listeningData,
  userAnswers = [],
  onClose,
}) => {
  
  const results = useMemo(() => {
    if (!userAnswers) return { details: [], totalScore: 0, totalQuestions: 0 };
    const userAnswersMap = new Map(
      userAnswers.map((u) => [u.questionId, u.answer])
    );

    let totalScore = 0;
    const processedResults: ScoreResultDetail[] = [];

    if (listeningData?.sections) {
      listeningData.sections.forEach((section) => {
        if (section.questions) {
          section.questions.forEach((question) => {
            const userAnsRaw = userAnswersMap.get(question.id); 
            
            let correctAnswersList: string[] = [];
            if (question.answers && question.answers.length > 0) {
                correctAnswersList = question.answers.map(a => a.answerText);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((question as any).answer) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                correctAnswersList = [String((question as any).answer)];
            }
            let isCorrect = false;
            let points = 0;

            if (typeof userAnsRaw === "string") {
              const normalizedUser = normalizeText(userAnsRaw);
              isCorrect = correctAnswersList.some(ans => normalizeText(ans) === normalizedUser);
              if (normalizedUser === "") isCorrect = false;
            }
            else if (Array.isArray(userAnsRaw)) {
              const userArray = userAnsRaw.map(String).sort();
              const validArray = correctAnswersList.map(String).sort();
              if (userArray.length > 0) {
                  isCorrect = JSON.stringify(userArray.map(normalizeText)) === JSON.stringify(validArray.map(normalizeText));
              }
            }

            if (isCorrect) {
                points = 1;
                totalScore += 1;
            }

            processedResults.push({
              sectionId: section.id,
              questionId: question.id,
              questionNumber: question.questionNumber,
              questionType: section.questionType,
              questionText: question.questionText || section.sectionTitle,
              userAnswer: userAnsRaw,
              correctAnswer: correctAnswersList.join(" / "), 
              isCorrect,
              points
            });
          });
        }
      });
    }

    return { 
        details: processedResults, 
        totalScore, 
        totalQuestions: processedResults.length 
    };
  }, [listeningData, userAnswers]);

  const { details, totalScore, totalQuestions } = results;

  const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  const resultsBySection = details.reduce((acc, result) => {
    if (!acc[result.sectionId]) {
      acc[result.sectionId] = [];
    }
    acc[result.sectionId].push(result);
    return acc;
  }, {} as Record<string, ScoreResultDetail[]>); 

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] w-full max-w-4xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-blue-600" /> 
            Listening Results - Part {listeningData.partNumber}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Review your performance details below.</p>
        </div>

        <div className="flex items-center gap-4">
            {/* Show Percentage Box */}
            <div className="text-left bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <span className={`text-3xl font-extrabold ${accuracy >= 50 ? "text-green-600" : "text-orange-500"}`}>
                    {accuracy}%
                </span>
            </div>

            {/* Show Score Fraction */}
            <div className="text-right bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <span className={`block text-3xl font-extrabold ${
                    totalQuestions > 0 && (totalScore / totalQuestions) >= 0.5 ? "text-green-600" : "text-orange-500"
                }`}>
                    {totalScore} <span className="text-gray-300 text-xl">/</span> {totalQuestions}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Score</span>
            </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
        {Object.entries(resultsBySection).map(([sectionId, sectionResults]) => {
           const section = listeningData.sections?.find(s => s.id === sectionId);
           
           return (
             <div key={sectionId} className="space-y-4">
                {section?.sectionTitle && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="h-4 w-1 bg-blue-500 rounded-full"></div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {section.sectionTitle}
                    </h4>
                  </div>
                )}

                {sectionResults.map((result) => (
                  <div
                    key={`${result.sectionId}-${result.questionId}`}
                    className={`p-4 rounded-xl border-l-[6px] transition-all shadow-sm bg-white ${
                      result.isCorrect
                        ? "border-l-green-500 border-t border-r border-b border-green-100/50"
                        : "border-l-red-500 border-t border-r border-b border-red-100/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0">
                        {result.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 fill-red-50" />
                        )}
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-gray-800 text-base flex items-center gap-2">
                            Question {result.questionNumber}
                            <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200 uppercase">
                                {result.questionType?.replace(/_/g, " ")}
                            </span>
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1 tracking-wider">Your Answer</span>
                            <div className={`text-sm font-semibold break-words ${result.isCorrect ? "text-green-700" : "text-red-600"}`}>
                              {renderAnswerContent(result.userAnswer)}
                            </div>
                          </div>

                          {!result.isCorrect && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                              <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1 tracking-wider">Correct Answer</span>
                              <div className="text-sm font-semibold text-blue-800 break-words">
                                {renderAnswerContent(result.correctAnswer)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           );
        })}
      </div>

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

export default ListeningScoring;