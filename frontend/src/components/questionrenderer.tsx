"use client";
import React from "react";
import MultipleChoice from "@/components/QuestionTypes/MultipleChoice";
import TrueFalseNotGiven from "./QuestionTypes/TrueFalseNotGiven";
import YesNoNotGiven from "./QuestionTypes/YesNoNotGiven";
import MatchingHeadings from "./QuestionTypes/MatchingHeadings";
import SentenceCompletion from "./QuestionTypes/SentenceCompletion";
import SummaryCompletion from "./QuestionTypes/SummaryCompletion";
import TableCompletion from "./QuestionTypes/TableCompletion";
import DiagramCompletion from "./QuestionTypes/DiagramCompletion";
import ShortAnswer from "./QuestionTypes/ShortAnswer";

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
}

interface Props {
  questions: Question[];
  onAnswerChange: (questionId: number, answer: unknown) => void;
}

const QuestionRenderer: React.FC<Props> = ({ questions, onAnswerChange }) => {
  return (
    <div className="space-y-6">
      {questions.map((q) => {
        switch (q.type) {
          case "multiple_choice":
            return (
              <MultipleChoice
                key={q.id}
                id={q.id}
                question={q.question}
                options={q.options ?? []}
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "true_false_not_given":
            return (
              <TrueFalseNotGiven 
                key={q.id} 
                {...q} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "yes_no_not_given":
            return (
              <YesNoNotGiven 
                key={q.id} 
                {...q} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "matching_headings":
            return (
              <MatchingHeadings 
                key={q.id} 
                {...q} 
                headings={q.headings ?? []} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "sentence_completion":
            return (
              <SentenceCompletion 
                key={q.id} 
                {...q} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "summary_completion":
            return (
              <SummaryCompletion 
                key={q.id} 
                {...q} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "table_completion":
            return (
              <TableCompletion 
                key={q.id} 
                {...q} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "diagram_label_completion":
            return (
              <DiagramCompletion 
                key={q.id} 
                {...q} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          case "short_answer":
            return (
              <ShortAnswer 
                key={q.id} 
                {...q} 
                onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
              />
            );
          default:
            return (
              <p key={q.id} className="text-red-500">
                ⚠️ Unsupported question type: {q.type}
              </p>
            );
        }
      })}
    </div>
  );
};

export default QuestionRenderer;