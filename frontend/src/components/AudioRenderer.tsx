'use client';
import React from "react";
import FormCompletion from "./ListeningTypes/FormCompletion";
import ListeningMultipleChoice from "./ListeningTypes/MultipleChoice";
import { Volume2, Headphones } from "lucide-react";

interface FormField {
  id: number;
  label: string;
  answer: string;
  wordLimit?: string;
  isInput: boolean;
  audioTimestamp?: string;
}

interface Question {
  id: number;
  question: string;
  options?: string[];
  answer: string | number;
  wordLimit?: string;
  audioTimestamp?: string;
}

interface Section {
  sectionId: number;
  sectionTitle: string;
  questionType: string;
  formFields?: FormField[];
  questions?: Question[];
  
}

interface ListeningData {
  id: number;
  partNumber: number;
  partTitle: string;
  audioUrl: string;
  audioDuration: number;
  context: string;
  instructions: string;
  wordLimit?: string;
  questionRange: string;
  sections: Section[];
}

interface Props {
  listeningData: ListeningData;
  onAnswerChange: (sectionId: number, questionId: number, answer: unknown) => void;
}

const ListeningRenderer: React.FC<Props> = ({ listeningData, onAnswerChange }) => {
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
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Part {listeningData.partNumber}
        </h1>
      </div>

      {/* Audio Player */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-700 font-bold">
            Questions {listeningData.questionRange}
          </span>
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Volume2 className="w-5 h-5" />
            <span className="font-medium underline">Listen from here</span>
          </button>
        </div>
        <audio
          ref={audioRef}
          src={listeningData.audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="w-full"
          controls
        />
      </div>

      {/* Context & Instructions */}
      <div className="mb-6">
        <p className="text-gray-600 mb-2">{listeningData.context}</p>
        <p className="text-gray-800">{listeningData.instructions}</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {listeningData.sections.map((section) => {
          // Form Completion
          if (section.questionType === "form_completion" && section.formFields) {
            return (
              <FormCompletion
                key={section.sectionId}
                id={section.sectionId}
                title={section.sectionTitle}
                instruction={listeningData.instructions}
                wordLimit={listeningData.wordLimit || ""}
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
          if (section.questionType === "multiple_choice" && section.questions) {
            return (
              
              <div key={section.sectionId}>
                <h1 className="mb-4 font-bold text-xl">Choose the correct option A, B, C, D</h1>
                {section.questions.map((q) => (
                  <ListeningMultipleChoice
                    key={q.id}
                    id={q.id}
                    question={q.question}
                    options={q.options || []}
                    onAnswerChange={(answer) => onAnswerChange(section.sectionId, q.id, answer)}
                  />
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default ListeningRenderer;