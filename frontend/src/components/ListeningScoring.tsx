"use client";
import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ListeningData, UserAnswer, ScoreResult } from "@/types/listening";

interface ScoringProps {
  listeningData: ListeningData;
  userAnswers: UserAnswer[];
  onClose?: () => void;
}

const ListeningScoring: React.FC<ScoringProps> = ({
  listeningData,
  userAnswers,
  onClose,
}) => {
  // --- EXISTING LOGIC (Unchanged) ---
  const scoreAnswers = (): ScoreResult[] => {
    const results: ScoreResult[] = [];

    listeningData.sections.forEach((section) => {
      // Form Completion
      if (section.questionType === "form_completion" && section.formFields) {
        section.formFields.forEach((field) => {
          if (!field.isInput) return;

          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId && ua.questionId === field.id
          );

          let isCorrect = false;
          let points = 0;

          if (userAnswer) {
            const normalizeAnswer = (ans: string) => ans.toLowerCase().trim();
            const correctAnswer = normalizeAnswer(field.answer);
            const userAnswerText = normalizeAnswer(userAnswer.answer as string);

            isCorrect = userAnswerText === correctAnswer;
            points = isCorrect ? 1 : 0;
          }

          results.push({
            sectionId: section.sectionId,
            questionId: field.id,
            isCorrect,
            userAnswer: userAnswer?.answer || null,
            correctAnswer: field.answer,
            points,
            questionType: "form_completion",
            questionText: field.label,
          });
        });
      }

      // Multiple Choice
      if (section.questionType === "multiple_choice" && section.questions) {
        section.questions.forEach((question) => {
          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId &&
              ua.questionId === question.id
          );

          let isCorrect = false;
          let points = 0;

          if (userAnswer) {
            isCorrect = userAnswer.answer === question.answer;
            points = isCorrect ? 1 : 0;
          }

          results.push({
            sectionId: section.sectionId,
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer?.answer ?? null,
            correctAnswer: question.answer,
            points,
            questionType: "multiple_choice",
            questionText: question.question || question.text || "",
          });
        });
      }

      // Short Answer
      if (section.questionType === "short_answer" && section.questions) {
        section.questions.forEach((question) => {
          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId &&
              ua.questionId === question.id
          );

          let isCorrect = false;
          let points = 0;

          if (userAnswer) {
            const normalizeAnswer = (ans: string) => ans.toLowerCase().trim();
            const correctAnswer = normalizeAnswer(question.answer as string);
            const userAnswerText = normalizeAnswer(userAnswer.answer as string);

            isCorrect = userAnswerText === correctAnswer;
            points = isCorrect ? 1 : 0;
          }

          results.push({
            sectionId: section.sectionId,
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer?.answer || null,
            correctAnswer: question.answer,
            points,
            questionType: "short_answer",
            questionText: question.text || question.question || "",
          });
        });
      }
      if (section.questionType === "multiple_answer" && section.questions) {
        section.questions.forEach((question) => {
          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId &&
              ua.questionId === question.id
          );

          let isCorrect = false;
          let points = 0;

          if (
            userAnswer &&
            Array.isArray(userAnswer.answer) &&
            Array.isArray(question.answer)
          ) {
            const correctAnswers = question.answer as number[];
            const userAnswerArray = userAnswer.answer as number[];
            // Sort both arrays for comparison
            const sortedCorrect = [...correctAnswers].sort((a, b) => a - b);
            const sortedUser = [...userAnswerArray].sort((a, b) => a - b);
            // Check if arrays are equal
            isCorrect =
              sortedCorrect.length === sortedUser.length &&
              sortedCorrect.every((val, idx) => val === sortedUser[idx]);
            // Partial scoring: count how many correct answers user got
            const correctCount = userAnswerArray.filter((ans) =>
              correctAnswers.includes(ans)
            ).length;
            points = correctCount; // Or use: isCorrect ? correctAnswers.length : 0
          }

          results.push({
            sectionId: section.sectionId,
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer?.answer ?? null,
            correctAnswer: question.answer,
            points,
            questionType: "multiple_answer",
            questionText: question.question || question.text || "",
          });
        });
      }
      //Note completion
      if (section.questionType === "note_completion" && section.questions) {
        section.questions.forEach((question) => {
          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId &&
              ua.questionId === question.id
          );

          let isCorrect = false;
          let points = 0;

          if (userAnswer) {
            const normalizeAnswer = (ans: string) => ans.toLowerCase().trim();
            const correctAnswer = normalizeAnswer(String(question.answer));
            const userAnswerText = normalizeAnswer(userAnswer.answer as string);
            isCorrect = userAnswerText === correctAnswer;
            points = isCorrect ? 1 : 0;
          }

          results.push({
            sectionId: section.sectionId,
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer?.answer || null,
            correctAnswer: question.answer,
            points,
            questionType: "note_completion",
            questionText: question.text,
          });
        });
      }
      if (section.questionType === "diagram_labeling" && section.steps) {
        section.steps.forEach((step) => {
          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId && ua.questionId === step.id
          );

          let isCorrect = false;
          let points = 0;

          if (userAnswer) {
            const normalizeAnswer = (ans: string) => ans.toLowerCase().trim();
            const correctAnswer = normalizeAnswer(step.answer);
            const userAnswerText = normalizeAnswer(userAnswer.answer as string);

            isCorrect = userAnswerText === correctAnswer;
            points = isCorrect ? 1 : 0;
          }

          results.push({
            sectionId: section.sectionId,
            questionId: step.id,
            isCorrect,
            userAnswer: userAnswer?.answer || null,
            correctAnswer: step.answer,
            points,
            questionType: "diagram_labeling",
            questionText: step.text,
          });
        });
      }
      if (section.questionType === "map_labeling" && section.questions) {
        section.questions.forEach((question) => {
          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId &&
              ua.questionId === question.id
          );
          let isCorrect = false;
          let points = 0;
          if (userAnswer) {
            const normalizeAnswer = (ans: string) => ans.toUpperCase().trim();
            const correctAnswer = normalizeAnswer(String(question.answer));
            const userAnswerText = normalizeAnswer(userAnswer.answer as string);

            isCorrect = userAnswerText === correctAnswer;
            points = isCorrect ? 1 : 0;
          }

          results.push({
            sectionId: section.sectionId,
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer?.answer || null,
            correctAnswer: question.answer,
            points,
            questionType: "map_labeling",
            questionText: question.question,
          });
        });
      }
      if (
        section.questionType === "matching_information" &&
        section.questions
      ) {
        section.questions.forEach((question) => {
          const userAnswer = userAnswers.find(
            (ua) =>
              ua.sectionId === section.sectionId &&
              ua.questionId === question.id
          );
          let isCorrect = false;
          let points = 0;
          if (userAnswer) {
            const normalizeAnswer = (ans: string) => ans.toUpperCase().trim();
            const correctAnswer = normalizeAnswer(String(question.answer));
            const userAnswerText = normalizeAnswer(userAnswer.answer as string);

            isCorrect = userAnswerText === correctAnswer;
            points = isCorrect ? 1 : 0;
          }

          results.push({
            sectionId: section.sectionId,
            questionId: question.id,
            isCorrect,
            userAnswer: userAnswer?.answer || null,
            correctAnswer: question.answer,
            points,
            questionType: "matching_information",
            questionText: question.text,
          });
        });
      }
    });

    return results;
  };

  const results = scoreAnswers();
  const totalScore = results.reduce((sum, result) => sum + result.points, 0);
  const maxPossibleScore = results.length;
  // Percentage is calculated but using maxPossibleScore from length
  // Note: multiple_answer might have points > 1 if configured that way, but maxPossibleScore is count of results.
  // Assuming 1 result object per question item.

  const getQuestionTypeDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      form_completion: "Form Completion",
      multiple_choice: "Multiple Choice",
      short_answer: "Short Answer",
      multiple_answer: "Multiple Answer",
      note_completion: "Note Completion",
      sentence_completion: "Sentence Completion",
      diagram_labeling: "Diagram Labeling",
      matching_: "Matching",
      matching_information: "Matching Information",
      map_labeling: "Map Labeling",
    };
    return typeMap[type] || type;
  };

  const formatAnswer = (
    answer: unknown,
    questionType: string,
    sectionId: number,
    questionId: number
  ): string => {
    if (answer === null || answer === undefined) return "No answer";

    if (questionType === "multiple_answer" && Array.isArray(answer)) {
      const section = listeningData.sections.find(
        (s) => s.sectionId === sectionId
      );
      if (section?.questions) {
        const question = section.questions.find((q) => q.id === questionId);
        if (question?.options) {
          return (answer as number[])
            .sort((a, b) => a - b)
            .map((idx) => {
              const letter = String.fromCharCode(65 + idx);
              return `${letter}. ${question.options![idx]}`;
            })
            .join(", ");
        }
      }
      // Fallback: just show letters
      return (answer as number[])
        .sort((a, b) => a - b)
        .map((idx) => String.fromCharCode(65 + idx))
        .join(", ");
    }

    if (questionType === "multiple_choice") {
      const section = listeningData.sections.find(
        (s) => s.sectionId === sectionId
      );
      if (section?.questions) {
        const question = section.questions.find((q) => q.id === questionId);
        if (question?.options && typeof answer === "number") {
          const letter = String.fromCharCode(65 + answer);
          return `${letter}. ${question.options[answer] || "Invalid option"}`;
        }
      }
    }

    return String(answer);
  };

  const resultsBySection = results.reduce((acc, result) => {
    if (!acc[result.sectionId]) {
      acc[result.sectionId] = [];
    }
    acc[result.sectionId].push(result);
    return acc;
  }, {} as Record<number, ScoreResult[]>);

  // --- NEW RENDER DESIGN ---

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] w-full max-w-4xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header: Score Summary */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-blue-600" />
            Listening Test Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Part {listeningData.partNumber} • Review your performance details below.
          </p>
        </div>
        <div className="text-right bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <span
            className={`block text-3xl font-extrabold ${
              totalScore / maxPossibleScore >= 0.5
                ? "text-green-600"
                : "text-orange-500"
            }`}
          >
            {totalScore}{" "}
            <span className="text-gray-300 text-xl">/</span> {maxPossibleScore}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Total Score
          </span>
        </div>
      </div>

      {/* Content: Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
        {Object.entries(resultsBySection).map(([sectionId, sectionResults]) => {
          const section = listeningData.sections.find(
            (s) => s.sectionId === parseInt(sectionId)
          );

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
                    {/* Status Icon */}
                    <div className="mt-1 flex-shrink-0">
                      {result.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 fill-red-50" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-800 text-base flex items-center gap-2 flex-wrap">
                          Question {result.questionId}
                          <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                            {getQuestionTypeDisplay(result.questionType)}
                          </span>
                        </h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${result.isCorrect ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}>
                            {result.points} pts
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {result.questionText}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Answer */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1 tracking-wider">
                            Your Answer
                          </span>
                          <div
                            className={`text-sm font-semibold break-words ${
                              result.isCorrect
                                ? "text-green-700"
                                : "text-red-600"
                            }`}
                          >
                            {formatAnswer(
                              result.userAnswer,
                              result.questionType,
                              result.sectionId,
                              result.questionId
                            )}
                          </div>
                        </div>

                        {/* Correct Answer - Display only if incorrect */}
                        {!result.isCorrect && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1 tracking-wider">
                              Correct Answer
                            </span>
                            <div className="text-sm font-semibold text-blue-800 break-words">
                              {formatAnswer(
                                result.correctAnswer,
                                result.questionType,
                                result.sectionId,
                                result.questionId
                              )}
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

        {results.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No questions found to score.
          </div>
        )}
      </div>

      {/* Footer */}
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