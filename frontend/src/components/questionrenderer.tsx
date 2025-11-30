"use client";
import React from "react";
import MultipleChoice from "@/components/QuestionTypes/MultipleChoice";
import TrueFalseNotGiven from "@/components/QuestionTypes/TrueFalseNotGiven";
import YesNoNotGiven from "@/components/QuestionTypes/YesNoNotGiven";
import MatchingHeadings from "@/components/QuestionTypes/MatchingHeadings";
import SentenceCompletion from "@/components/QuestionTypes/SentenceCompletion";
import SummaryCompletion from "@/components/QuestionTypes/SummaryCompletion";
import TableCompletion from "@/components/QuestionTypes/TableCompletion";
import DiagramCompletion from "@/components/QuestionTypes/DiagramCompletion";
import ShortAnswer from "@/components/QuestionTypes/ShortAnswer";
import GapFilling from "@/components/QuestionTypes/GapFilling";
import MatchingNames from "@/components/QuestionTypes/MatchingNames";

import { ReadingSection } from "@/types/ReadingInterfaces";

interface Props {
  sections: ReadingSection[];
  onAnswerChange: (questionId: string, answer: unknown) => void;
}
const InstructionBlock = ({ type }: { type: "YES" | "TRUE" }) => {
  const isYes = type === "YES";
  const label1 = isYes ? "YES" : "TRUE";
  const label2 = isYes ? "NO" : "FALSE";
  return (
    <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm">
      <div className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-4 text-sm">
        <span className="font-bold text-blue-700">{label1}</span>
        <span className="text-gray-600">if the statement agrees with the views of the writer</span>

        <span className="font-bold text-blue-700">{label2}</span>
        <span className="text-gray-600">if the statement contradicts the views of the writer</span>

        <span className="font-bold text-blue-700">NOT GIVEN</span>
        <span className="text-gray-600">if it is impossible to say what the writer thinks about this</span>
      </div>
    </div>
  );
};

const QuestionRenderer: React.FC<Props> = ({ sections, onAnswerChange }) => {
  const renderSectionQuestions = (section: ReadingSection) => {
  const { questionType, questions } = section;
  

    switch (questionType) {
      case "multiple_choice":
        return questions.map((q) => (
          <MultipleChoice
            key={q.id}
            id={q.id}
            questionNumber={q.questionNumber}
            question={q.questionText}
            options={q.options?.map((o) => o.text) ?? []}
            onAnswerChange={(_id, value) => onAnswerChange(q.id, value)}
          />
        ));

      case "true_false_not_given":
        return (
          <div key={section.sectionId} className="mb-8">
            <InstructionBlock type="TRUE" />
            <div className="space-y-2">
              {questions.map((q) => (
                <TrueFalseNotGiven 
                  key={q.id}
                  id={q.id}
                  questionNumber={q.questionNumber}
                  question={q.questionText}
                  options={["True", "False", "Not Given"]}
                  onAnswerChange={(_id, value) => onAnswerChange(q.id, value)}
                />
              ))}
            </div>
          </div>
        );

     case "yes_no_not_given":
        return (
          <div key={section.sectionId} className="mb-8">
            <InstructionBlock type="YES" />

            <div className="space-y-2">
              {questions.map((q) => (
                <YesNoNotGiven
                  key={q.id}
                  id={q.id}
                  questionNumber={q.questionNumber} 
                  question={q.questionText}
                  options={["Yes", "No", "Not Given"]}
                  onAnswerChange={(_id, value) => onAnswerChange(q.id, value)}
                />
              ))}
            </div>
          </div>
        );

      case "matching_headings":
        return (
          <MatchingHeadings
            key={section.sectionId}
            section={section}
            onAnswerChange={(questionId, answer) => {
              onAnswerChange(questionId, answer);
            }}
          />
        );

      case "sentence_completion":
        return questions.map((q) => (
          <SentenceCompletion
            key={q.id}
            id={q.id}
            question={q.questionText}
            wordLimit={section.wordLimit || ""}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "summary_completion":
        let summaryOptions: string[] = [];
        if (section.optionRange) {
          summaryOptions = section.optionRange.split(",");
        }

        return questions.map((q) => (
          <SummaryCompletion
            key={q.id}
            id={q.id}
            question={q.questionText}
            options={summaryOptions}
            range=""
            questionRange=""
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "table_completion":
        if (section.tableJson) {
          try {
            const tableData = JSON.parse(section.tableJson);
            return (
              <TableCompletion
                key={section.sectionId}
                id={section.sectionId}
                instructions={section.instructions}
                table={tableData}
                questions={section.questions}
                onAnswerChange={(answers) => {
                  Object.entries(answers).forEach(([qId, ans]) => {
                    onAnswerChange(qId, ans);
                  });
                }}
              />
            );
          } catch (e) {
            return <div className="text-red-500">Error parsing table data</div>;
          }
        }
        return null;

      case "diagram_label_completion":
        return (
          <DiagramCompletion
            key={section.sectionId}
            id={section.sectionId}
            instructions={section.instructions}
            questions={section.questions}
            onAnswerChange={(answers) => {
              Object.entries(answers).forEach(([qId, ans]) => {
                onAnswerChange(qId, ans);
              });
            }}
          />
        );

      case "short_answer":
        return questions.map((q) => (
          <ShortAnswer
            key={q.id}
            id={q.id}
            question={q.questionText}
            wordLimit={section.wordLimit || ""}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
          />
        ));

      case "gap_filling":
        let finalText = section.gapFillText;
        if (!finalText && questions.length > 0) {
          finalText = questions.map((q) => q.questionText).join(" ");
        }

        if (!finalText) return null;
        return (
          <GapFilling
            key={section.sectionId}
            id={section.sectionId}
            question={section.instructions}
            text={finalText}
            questions={questions}
            wordLimit={section.wordLimit || ""}
            onAnswerChange={(currentSectionAnswers) => {
              Object.entries(currentSectionAnswers).forEach(([qId, ans]) => {
                onAnswerChange(qId, ans);
              });
            }}
            blanks={[]}
          />
        );

      case "matching_names":
        return (
          <MatchingNames
            key={section.sectionId}
            section={section}
            onAnswerChange={(questionId, value) => {
              onAnswerChange(questionId, value);
            }}
          />
        );

      default:
        return (
          <p
            key={section.sectionId}
            className="text-red-500 font-bold p-4 border border-red-300 bg-red-50"
          >
            ⚠️ Unknown Question Type: {questionType}
          </p>
        );
    }
  };

  return (
    <div className="">
      {sections.map((section) => (
        <div key={section.sectionId} className="">
          {/* Section Header */}
          {/* <div className="mb-4 border-b pb-3">
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
          </div> */}
          {/* Section Questions */}
          <div className="space-y-6">{renderSectionQuestions(section)}</div>
        </div>
      ))}
    </div>
  );
};

export default QuestionRenderer;
