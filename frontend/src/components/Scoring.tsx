"use client";
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  paragraphs?: string[];
  headings?: string[];
  text?: string;
  wordLimit?: string;
  table?: {
    columns: string[];
    rows: string[][];
  };
  diagram?: string[];
  answer: unknown;
  answerType?: string;
}

interface UserAnswer {
  questionId: number;
  answer: unknown;
}

interface ScoringProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onClose?: () => void;
}

interface ScoreResult {
  questionId: number;
  isCorrect: boolean;
  userAnswer: unknown;
  correctAnswer: unknown;
  points: number;
}

const Scoring: React.FC<ScoringProps> = ({ questions, userAnswers, onClose }) => {
  const scoreAnswers = (): ScoreResult[] => {
    return questions.map(question => {
      const userAnswer = userAnswers.find(ua => ua.questionId === question.id);
      let isCorrect = false;
      let points = 0;

      if (!userAnswer) {
        return {
          questionId: question.id,
          isCorrect: false,
          userAnswer: null,
          correctAnswer: question.answer,
          points: 0
        };
      }

      switch (question.type) {
        case "multiple_choice":
  if (question.answerType === "single") {
    // Single choice: chỉ cần so sánh index
    isCorrect = userAnswer.answer === question.answer;
    points = isCorrect ? 1 : 0;
  } else if (question.answerType === "multiple") {
    // Multiple choice: so sánh mảng
    const correctAnswers = Array.isArray(question.answer)
      ? (question.answer as number[])
      : [question.answer as number];
    const userAnswersArray = Array.isArray(userAnswer.answer)
      ? (userAnswer.answer as number[])
      : [userAnswer.answer as number];

    let correctCount = 0;
    correctAnswers.forEach((ans) => {
      if (userAnswersArray.includes(ans)) {
        correctCount++;
      }
    });

    isCorrect = correctCount === correctAnswers.length &&
                correctAnswers.length === userAnswersArray.length;

    // Chấm partial: mỗi đáp án đúng được 1 điểm
    points = correctCount;
  }
  break;


        case 'true_false_not_given':
        case 'yes_no_not_given':
          isCorrect = userAnswer.answer === question.answer;
          points = isCorrect ? 1 : 0;
          break;

        case 'matching_headings':
          // Answer is an object with paragraph-heading mappings
          const correctMatches = question.answer as Record<string, string>;
          const userMatches = userAnswer.answer as Record<string, string>;
          
          let correctCount = 0;
          const totalParagraphs = Object.keys(correctMatches).length;
          
          Object.keys(correctMatches).forEach(paragraph => {
            if (userMatches[paragraph] === correctMatches[paragraph]) {
              correctCount++;
            }
          });
          
          isCorrect = correctCount === totalParagraphs;
          points = correctCount; // Partial scoring
          break;

        case 'sentence_completion':
        case 'short_answer':
          // Normalize strings for comparison (lowercase, trim)
          const normalizeAnswer = (ans: string) => ans.toLowerCase().trim();
          const correctAnswer = normalizeAnswer(question.answer as string);
          const userAnswerText = normalizeAnswer(userAnswer.answer as string);
          
          isCorrect = userAnswerText === correctAnswer;
          points = isCorrect ? 1 : 0;
          break;

        case 'summary_completion':
          // Answer may be string or array
          const correctWords = Array.isArray(question.answer)
            ? question.answer as string[]
            : typeof question.answer === 'string'
              ? [question.answer]
              : [];
          const userWords = Array.isArray(userAnswer.answer)
            ? userAnswer.answer as string[]
            : typeof userAnswer.answer === 'string'
              ? [userAnswer.answer]
              : [];

          let correctWordsCount = 0;
          correctWords.forEach((word, index) => {
            if (userWords[index] && 
                userWords[index].toLowerCase().trim() === word.toLowerCase().trim()) {
              correctWordsCount++;
            }
          });

          isCorrect = correctWordsCount === correctWords.length;
          points = correctWordsCount; // Partial scoring
          break;

        case 'table_completion':
          // Answer is an object with group-answer mappings
          const correctTableAnswers = question.answer as Record<string, string[]>;
          const userTableAnswers = typeof userAnswer.answer === 'object' && userAnswer.answer !== null ? userAnswer.answer as Record<string, string[]> : {};

          let correctTableCount = 0;
          let totalTableAnswers = 0;

          Object.keys(correctTableAnswers).forEach(group => {
            const correctGroupAnswers = Array.isArray(correctTableAnswers[group]) ? correctTableAnswers[group] : [correctTableAnswers[group]];
            const userGroupAnswers = Array.isArray(userTableAnswers[group]) ? userTableAnswers[group] : [userTableAnswers[group]];

            correctGroupAnswers.forEach((correctAns, index) => {
              totalTableAnswers++;
              if (userGroupAnswers[index] && 
                  userGroupAnswers[index].toLowerCase().trim() === correctAns.toLowerCase().trim()) {
                correctTableCount++;
              }
            });
          });

          isCorrect = correctTableCount === totalTableAnswers;
          points = correctTableCount; // Partial scoring
          break;

        case 'diagram_label_completion':
          // Answer may be string or array
          const correctLabels = Array.isArray(question.answer)
            ? question.answer as string[]
            : typeof question.answer === 'string'
              ? [question.answer]
              : [];
          const userLabels = Array.isArray(userAnswer.answer)
            ? userAnswer.answer as string[]
            : typeof userAnswer.answer === 'string'
              ? [userAnswer.answer]
              : [];

          let correctLabelsCount = 0;
          correctLabels.forEach((label, index) => {
            if (userLabels[index] && 
                userLabels[index].toLowerCase().trim() === label.toLowerCase().trim()) {
              correctLabelsCount++;
            }
          });

          isCorrect = correctLabelsCount === correctLabels.length;
          points = correctLabelsCount; // Partial scoring
          break;

        default:
          points = 0;
      }

      return {
        questionId: question.id,
        isCorrect,
        userAnswer: userAnswer.answer,
        correctAnswer: question.answer,
        points
      };
    });
  };

  const results = scoreAnswers();
  const totalScore = results.reduce((sum, result) => sum + result.points, 0);
  const maxPossibleScore = questions.length; // Adjust this based on your scoring system
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  const getQuestionTypeDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      'multiple_choice': 'Multiple Choice',
      'true_false_not_given': 'True/False/Not Given',
      'yes_no_not_given': 'Yes/No/Not Given',
      'matching_headings': 'Matching Headings',
      'sentence_completion': 'Sentence Completion',
      'summary_completion': 'Summary Completion',
      'table_completion': 'Table Completion',
      'diagram_label_completion': 'Diagram Labeling',
      'short_answer': 'Short Answer'
    };
    return typeMap[type] || type;
  };

  const formatAnswer = (answer: unknown, questionType: string): string => {
    if (answer === null || answer === undefined) return 'No answer';
    
    switch (questionType) {
      case 'multiple_choice':
        return `Option ${(answer as number) + 1}`;
      case 'matching_headings':
      case 'table_completion':
        return JSON.stringify(answer, null, 2);
      case 'summary_completion':
      case 'diagram_label_completion':
        return Array.isArray(answer) ? answer.join(', ') : String(answer);
      default:
        return String(answer);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Test Results</h2>
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">Overall Score</p>
              <p className="text-3xl font-bold">{totalScore}/{maxPossibleScore}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">Percentage</p>
              <p className="text-3xl font-bold">{percentage}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Question Details</h3>
        {results.map((result, index) => {
          const question = questions.find(q => q.id === result.questionId)!;
          
          return (
            <div 
              key={result.questionId} 
              className={`p-4 rounded-lg border-2 ${
                result.isCorrect 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
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
                    {getQuestionTypeDisplay(question.type)}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${
                    result.isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.points} pts
                  </span>
                </div>
              </div>

              <p className="text-gray-800 mb-3">{question.question}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                  <p className={`p-2 rounded ${
                    result.isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formatAnswer(result.userAnswer, question.type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</p>
                  <p className="p-2 bg-blue-100 text-blue-800 rounded">
                    {formatAnswer(result.correctAnswer, question.type)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {onClose && (
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3  bg-[#336699] text-white rounded-3xl hover:bg-blue-700 transition-colors"
          >
            Close Results
          </button>
        </div>
      )}
    </div>
  );
};

export default Scoring;