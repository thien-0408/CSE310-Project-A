"use client";
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
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
  (section.questions).forEach((question) => {
    const userAnswer = userAnswers.find(
      (ua) => ua.sectionId === section.sectionId && ua.questionId === question.id
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
    });

    return results;
  };

  const results = scoreAnswers();
  const totalScore = results.reduce((sum, result) => sum + result.points, 0);
  const maxPossibleScore = results.length;
  const percentage =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  const getQuestionTypeDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      form_completion: "Form Completion",
      multiple_choice: "Multiple Choice",
      short_answer: "Short Answer",
      multiple_answer: "Multiple Answer",
      note_completion: "Note Completion",
      sentence_completion: "Sentence Completion",
      diagram_labeling: "Diagram Labeling",
      matching: "Matching",
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Listening Test Results - Part {listeningData.partNumber}
        </h2>
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">Overall Score</p>
              <p className="text-3xl font-bold">
                {totalScore}/{maxPossibleScore}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">Percentage</p>
              <p className="text-3xl font-bold">{percentage}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Question Details
        </h3>

        {Object.entries(resultsBySection).map(([sectionId, sectionResults]) => {
          const section = listeningData.sections.find(
            (s) => s.sectionId === parseInt(sectionId)
          );

          return (
            <div key={sectionId} className="space-y-4">
              {section?.sectionTitle && (
                <h4 className="text-lg font-semibold text-blue-700 mt-4">
                  {section.sectionTitle}
                </h4>
              )}

              {sectionResults.map((result) => (
                <div
                  key={`${result.sectionId}-${result.questionId}`}
                  className={`p-4 rounded-lg border-2 ${
                    result.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {result.isCorrect ? (
                        <CheckCircle className="text-green-600 w-5 h-5" />
                      ) : (
                        <XCircle className="text-red-600 w-5 h-5" />
                      )}
                      <span className="font-semibold text-gray-700">
                        Question {result.questionId}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {getQuestionTypeDisplay(result.questionType)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold ${
                          result.isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.points} pts
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3">{result.questionText}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Your Answer:
                      </p>
                      <p
                        className={`p-2 rounded ${
                          result.isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {formatAnswer(
                          result.userAnswer,
                          result.questionType,
                          result.sectionId,
                          result.questionId
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Correct Answer:
                      </p>
                      <p className="p-2 bg-blue-100 text-blue-800 rounded">
                        {formatAnswer(
                          result.correctAnswer,
                          result.questionType,
                          result.sectionId,
                          result.questionId
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {onClose && (
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#336699] text-white rounded-3xl hover:bg-blue-700 transition-colors"
          >
            Close Results
          </button>
        </div>
      )}
    </div>
  );
};

export default ListeningScoring;
