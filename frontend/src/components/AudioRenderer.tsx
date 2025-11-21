"use client";
import React from "react";
import FormCompletion from "./ListeningTypes/FormCompletion";
import ListeningMultipleChoice from "./ListeningTypes/MultipleChoice";
import ListeningShortAnswer from "./ListeningTypes/ShortAnswer";
import { ListeningData, Question } from "@/types/listening";
import ListeningMultipleAnswer from "./ListeningTypes/MultipleAnswer";
import ListeningNoteCompletion from "./ListeningTypes/NoteCompletion";
import ListeningDiagramLabeling from "./ListeningTypes/DiagramLabeling";
import ListeningMapLabeling from "./ListeningTypes/Map";
import MatchingInformation from "./ListeningTypes/MatchingInformation";
import IELTSCountdownTimer from "@/components/ui/coutdownTimer";

import CustomAudioPlayer from "./ui/CustomAudioPlayer";

interface Props {
  listeningData: ListeningData;
  onAnswerChange: (
    sectionId: number,
    questionId: number,
    answer: unknown
  ) => void;
}

const ListeningRenderer: React.FC<Props> = ({
  listeningData,
  onAnswerChange,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
    
      <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center gap-4 px-4 py-2">
          {/* --- Left div--- */}
          <div className="flex items-center gap-3 flex-none lg:ml-4"></div>
          {/*Audio player bar */}
          <div className="flex-1 flex justify-center">
            <CustomAudioPlayer src={listeningData.audioUrl} />
          </div>
          {/* ---Right div--- */}
          <div className="flex-none hidden md:block"></div>
        </div>
      </header>
      
      <IELTSCountdownTimer></IELTSCountdownTimer>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Part {listeningData.partNumber}
          </h1>
        </div>
        {/*Question range here */}

        {/* Context & Instructions */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">{listeningData.context}</p>
          <p className="text-gray-800">{listeningData.instructions}</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {listeningData.sections.map((section) => {
            // Form Completion
            if (
              section.questionType === "form_completion" &&
              section.formFields
            ) {
              return (
                <FormCompletion
                  key={section.sectionId}
                  id={section.sectionId}
                  title={section.sectionTitle}
                  instruction={section.instruction || ""}
                  wordLimit={section.wordLimit || ""}
                  formFields={section.formFields}
                  onAnswerChange={(answers) => {
                    Object.entries(answers).forEach(([qId, answer]) => {
                      onAnswerChange(section.sectionId, parseInt(qId), answer);
                    });
                  }}
                />
              );
            }

            // Multiple Choice
            if (
              section.questionType === "multiple_choice" &&
              section.questions
            ) {
              return (
                <div key={section.sectionId}>
                  {section.questions.map((q) => (
                    <ListeningMultipleChoice
                      key={q.id}
                      id={q.id}
                      question={q.question || q.text || ""}
                      options={q.options || []}
                      onAnswerChange={(answer) =>
                        onAnswerChange(section.sectionId, q.id, answer)
                      }
                    />
                  ))}
                </div>
              );
            }

            // Short Answer
            if (section.questionType === "short_answer" && section.questions) {
              return (
                <ListeningShortAnswer
                  key={section.sectionId}
                  sectionId={section.sectionId}
                  instruction={
                    section.instruction || listeningData.instructions
                  }
                  wordLimit={
                    section.wordLimit ||
                    listeningData.wordLimit ||
                    "NO MORE THAN THREE WORDS"
                  }
                  questions={section.questions}
                  onAnswerChange={onAnswerChange}
                />
              );
            }
            // Multiple answer
            if (
              section.questionType === "multiple_answer" &&
              section.questions
            ) {
              return (
                <div key={section.sectionId}>
                  {section.questions.map((q) => (
                    <ListeningMultipleAnswer
                      key={q.id}
                      id={q.id}
                      question={q.question || q.text || ""}
                      instruction={section.instruction}
                      options={q.options || []}
                      maxAnswers={section.maxAnswers || q.maxAnswers || 2}
                      onAnswerChange={(answer) =>
                        onAnswerChange(section.sectionId, q.id, answer)
                      }
                    />
                  ))}
                </div>
              );
            }
            //Note Completion
            if (
              section.questionType === "note_completion" &&
              section.questions
            ) {
              return (
                <ListeningNoteCompletion
                  key={section.sectionId}
                  sectionId={section.sectionId}
                  sectionTitle={section.sectionTitle}
                  instruction={
                    section.instruction || listeningData.instructions
                  }
                  wordLimit={
                    section.wordLimit ||
                    listeningData.wordLimit ||
                    "NO MORE THAN THREE WORDS"
                  }
                  questions={section.questions as Question[]}
                  onAnswerChange={onAnswerChange}
                />
              );
            }
            // Diagram Labeling
            if (section.questionType === "diagram_labeling" && section.steps) {
              return (
                <ListeningDiagramLabeling
                  key={section.sectionId}
                  sectionId={section.sectionId}
                  title={section.title || "Complete the diagram"}
                  instruction={
                    section.instruction || listeningData.instructions
                  }
                  wordLimit={section.wordLimit || listeningData.wordLimit || ""}
                  options={section.options}
                  steps={section.steps}
                  onAnswerChange={onAnswerChange}
                />
              );
            }
            // Map
            if (section.questionType === "map_labeling" && section.questions) {
              return (
                <ListeningMapLabeling
                  key={section.sectionId}
                  sectionId={section.sectionId}
                  title={section.title || "Label the map"}
                  instruction={
                    section.instruction || listeningData.instructions
                  }
                  mapImageUrl={section.mapImageUrl}
                  options={section.options || []}
                  questions={section.questions as []}
                  onAnswerChange={onAnswerChange}
                />
              );
            }
            if (
              section.questionType === "matching_information" &&
              section.questions
            ) {
              return (
                <MatchingInformation
                  key={section.sectionId}
                  sectionId={section.sectionId}
                  title={section.title || "Label the map"}
                  instruction={
                    section.instruction || listeningData.instructions
                  }
                  options={section.options || []}
                  questions={section.questions as []}
                  onAnswerChange={onAnswerChange}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    </>
  );
};

export default ListeningRenderer;
