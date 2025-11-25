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
import IELTSTimer from "@/components/ui/coutdownTimer";
import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";

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
    
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm h-[72px]">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        
        {/* --- LEFT: Context & Navigation --- */}
        <div className="flex items-center gap-3 flex-none w-[200px] lg:w-[250px]">
          <Link 
            href="/dashboard" 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            title="Thoát bài thi"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FileText className="w-3 h-3" />
              <span>IELTS Listening</span>
            </div>
          </div>
        </div>

        {/* --- CENTER: Audio Player --- */}
        {/* Flex-1 để chiếm khoảng trống còn lại, max-w để không bị bè ra quá mức trên màn hình to */}
        <div className="flex-1 flex justify-center max-w-2xl">
          <CustomAudioPlayer src={listeningData.audioUrl} />
        </div>

        {/* --- RIGHT: Timer & Actions --- */}
        <div className="flex items-center justify-end gap-3 flex-none w-[200px] lg:w-[250px]">
          
          {/* Timer được đưa vào đây. 
              Sử dụng className để override style cũ nếu cần (ví dụ bỏ shadow hoặc đổi màu nền cho hợp navbar) 
          */}
          <div className="hidden md:block transform scale-90"> 
             <IELTSTimer 
                onTimeUpdate={(s) => console.log(s)} 
                // Truyền class để Timer trông gọn hơn trong Navbar
                className="flex-row !gap-0" 
             />
          </div>

          <div className="h-8 w-[1px] bg-gray-300 mx-1 hidden md:block"></div>

          
        </div>

      </div>
      
      {/* Mobile Only: Timer Bar 
          Nếu màn hình quá nhỏ (điện thoại), Timer trên Navbar sẽ chật, 
          ta đưa nó xuống 1 thanh mỏng bên dưới */}
      <div className="md:hidden bg-blue-50 border-b border-blue-100 p-1 flex justify-center">
         <IELTSTimer 
            className="scale-75 origin-center !flex-row" 
            onTimeUpdate={(s) => {}}
         />
      </div>
    </header>
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
