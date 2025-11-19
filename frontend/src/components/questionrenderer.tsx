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
import GapFilling from "./QuestionTypes/GapFilling";
import MatchingNames from "./QuestionTypes/MatchingNames";

// Import interfaces từ file types
import type { ReadingSection } from "../types/reading";

interface Props {
  sections: ReadingSection[];
  onAnswerChange: (questionId: number, answer: unknown) => void;
}

const QuestionRenderer: React.FC<Props> = ({ sections, onAnswerChange }) => {
  const renderSectionQuestions = (section: ReadingSection) => {
    const { questionType, questions } = section;

    switch (questionType) {
      case "multiple_choice":
        return questions.map((q) => (
          <MultipleChoice
            key={q.id}
            id={q.id}
            question={q.question}
            options={q.options ?? []}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "true_false_not_given":
        return questions.map((q) => (
          <TrueFalseNotGiven
            key={q.id}
            id={q.id}
            question={q.question}
            options={["True", "False", "Not Given"]}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "yes_no_not_given":
        return questions.map((q) => (
          <YesNoNotGiven
            key={q.id}
            id={q.id}
            question={q.question}
            options={["Yes", "No", "Not Given"]}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "matching_headings":
        // Matching headings: headings ở section level, paragraphs ở question level
        return (
          <MatchingHeadings
            key={`section-${section.sectionId}`}
            id={section.sectionId}
            question={
              section.instructions || "Match the headings with the paragraphs."
            }
            headings={section.headings ?? []}
            // Tạo array paragraphs từ questions
            paragraphs={questions.map((q) => q.question)}
            options={[]} // Không dùng options cho matching headings
            onAnswerChange={(answer) => {
              // answer là object: { "Paragraph A": "ii", "Paragraph B": "i" }
              // Cần map sang từng question individual
              questions.forEach((q, idx) => {
                const paragraphKey = q.question; // "Paragraph A", "Paragraph B"...
                const selectedHeading = (answer as Record<string, string>)[
                  paragraphKey
                ];
                if (selectedHeading) {
                  onAnswerChange(q.id, selectedHeading);
                }
              });
            }}
          />
        );

      case "sentence_completion":
        return questions.map((q) => (
          <SentenceCompletion
            key={q.id}
            id={q.id}
            question={q.question}
            wordLimit={q.wordLimit || section.wordLimit}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "summary_completion":
        return questions.map((q) => (
          <SummaryCompletion
            key={q.id}
            id={q.id}
            question={q.question}
            options={section.options ?? []}
            // wordLimit={section.wordLimit}
            range={q.range}
            questionRange={q.questionRange}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "table_completion":
        if (section.table) {
          return (
            <TableCompletion
              key={section.sectionId}
              id={section.sectionId}
              instructions={section.instructions || "Complete the table"}
              table={section.table}
              onAnswerChange={(answers) => {
                Object.entries(answers).forEach(([qId, ans]) => {
                  onAnswerChange(parseInt(qId), ans);
                });
              }}
            />
          );
        }
        return null;

      case "diagram_label_completion":
        return (
          <DiagramCompletion
            key={section.sectionId}
            id={section.sectionId}
            instructions={section.instructions || "Label the diagram"}
            questions={section.questions} // Mảng question chứa 'diagram'
            // Nếu có ảnh trong data (ví dụ section.image), bạn có thể truyền vào:
            // image={section.text} (hoặc field nào chứa URL ảnh)
            onAnswerChange={(answers) => {
              Object.entries(answers).forEach(([qId, ans]) => {
                onAnswerChange(parseInt(qId), ans);
              });
            }}
          />
        );

      case "short_answer":
        return questions.map((q) => (
          <ShortAnswer
            key={q.id}
            id={q.id}
            question={q.question}
            // wordLimit={q.wordLimit || section.wordLimit}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "gap_filling":
        if (section.text) {
          // Case 1: Text chung (Summary Completion / Gap Filling đoạn văn)
          return (
            <GapFilling
              key={`gap-section-${section.sectionId}`}
              id={section.sectionId}
              question={section.instructions || "Complete the text below."}
              text={section.text}
              // Map questions thành format Blank[] mà GapFilling cần
              blanks={section.questions.map((q) => ({
                index: q.id,
                answer: q.answer as string,
              }))}
              wordLimit={section.wordLimit || ""}
              // Quan trọng: Xử lý khi user nhập liệu
              onAnswerChange={(currentSectionAnswers) => {
                Object.entries(currentSectionAnswers).forEach(([qId, ans]) => {
                  onAnswerChange(parseInt(qId), ans);
                });
              }}
            />
          );
        } else {
          // Case 2: Sentence Completion (Mỗi câu hỏi có text riêng)
          // Logic này của bạn ĐÚNG, nhưng cần đảm bảo GapFilling handle tốt
          // trường hợp text ngắn chỉ có 1 chỗ trống.
          return section.questions.map((q) => (
            <GapFilling
              key={`gap-q-${q.id}`}
              id={q.id}
              question={section.instructions || ""}
              text={q.question}
              blanks={[{ index: q.id, answer: q.answer as string }]}
              wordLimit={section.wordLimit}
              onAnswerChange={(answers) => {
                if (answers[q.id]) {
                  onAnswerChange(q.id, answers[q.id]);
                }
              }}
            />
          ));
        }

      case "matching_names":
        return (
          <MatchingNames
            key={section.sectionId}
            id={section.sectionId}
            instructions={section.instructions || "Match the items"}
            questions={section.questions} // Truyền thẳng mảng questions từ JSON
            options={section.options || []}
            onAnswerChange={(answers) => {
              Object.entries(answers).forEach(([qId, ans]) => {
                onAnswerChange(parseInt(qId), ans);
              });
            }}
          />
        );

      default:
        return (
          <p key={section.sectionId} className="text-red-500">
            ⚠️ Loại câu hỏi không được hỗ trợ: {questionType}
          </p>
        );
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div
          key={section.sectionId}
          className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          {/* Section Header */}
          <div className="mb-4 border-b pb-3">
            {section.sectionRange && (
              <p className="text-sm text-blue-600 font-semibold mb-1">
                {section.sectionRange}
              </p>
            )}
            {section.sectionTitle && (
              <h2 className="text-xl font-bold text-gray-800">
                {section.sectionTitle}
              </h2>
            )}
            {section.instructions && (
              <p className="text-gray-600 mt-2 italic">
                {section.instructions}
              </p>
            )}
            {section.wordLimit && (
              <p className="text-sm text-red-600 font-medium mt-1">
                Word limit: {section.wordLimit}
              </p>
            )}
          </div>

          {/* Section Questions */}
          <div className="space-y-6">{renderSectionQuestions(section)}</div>
        </div>
      ))}
    </div>
  );
};

export default QuestionRenderer;
