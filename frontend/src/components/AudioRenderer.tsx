"use client";
import Link from "next/link";
import { ChevronLeft, LogOut } from "lucide-react";
// --- IMPORT COMPONENTS ---
import FormCompletion from "./ListeningTypes/FormCompletion";
import ListeningMultipleChoice from "./ListeningTypes/MultipleChoice";
import ListeningShortAnswer from "./ListeningTypes/ShortAnswer";
import ListeningMultipleAnswer from "./ListeningTypes/MultipleAnswer";
import ListeningNoteCompletion from "./ListeningTypes/NoteCompletion";
import ListeningDiagramLabeling from "./ListeningTypes/DiagramLabeling";
import ListeningMapLabeling from "./ListeningTypes/Map";
import MatchingInformation from "./ListeningTypes/MatchingInformation";
import IELTSTimer from "@/components/ui/coutdownTimer";
import CustomAudioPlayer from "./ui/CustomAudioPlayer";
import { ListeningPart } from "@/types/listening";
import FullScreenButton from "./ui/fullscreen";
import { Button } from "./ui/button";

interface Props {
  listeningData: ListeningPart;
  audioUrl?: string;
  onAnswerChange: (questionId: string, answer: unknown) => void;
}

const ListeningRenderer: React.FC<Props> = ({
  listeningData,
  audioUrl,
  onAnswerChange,
}) => {
  const currentAudioSrc = listeningData.partAudioUrl || audioUrl || "";
  console.log(currentAudioSrc);

  return (
    <>
      {/* --- MAIN CONTENT --- */}
      <div className="max-w-4xl mx-auto p-6 pb-24">
        {/* Part Info */}
        <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            {listeningData.partTitle || `Part ${listeningData.partNumber}`}
          </h1>
          <p className="text-blue-700 italic text-sm">
            {listeningData.context}
          </p>
          <div className="mt-4 inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 border border-blue-200 shadow-sm">
            Questions {listeningData.questionRange}
          </div>
        </div>

        {/* SECTIONS LOOP */}
        <div className="space-y-12">
          {listeningData.sections.map((section) => {
            const { questionType } = section;

            // --- 1. FORM COMPLETION ---
            if (
              questionType === "form_completion" ||
              questionType === "note_completion"
            ) {
              return (
                <FormCompletion
                  key={section.id}
                  id={section.id} // GUID
                  title={section.sectionTitle}
                  instruction={section.instructions}
                  wordLimit={section.wordLimit || ""}
                  questions={section.questions}
                  onAnswerChange={(qId, ans) => onAnswerChange(qId, ans)}
                />
              );
            }

            // --- 2. MULTIPLE CHOICE ---
            if (questionType === "multiple_choice") {
              return (
                <div key={section.id} className="space-y-6">
                  <h3 className="font-bold text-gray-700 border-b pb-2">
                    {section.sectionTitle}
                  </h3>

                  {section.questions.map((q) => (
                    <ListeningMultipleChoice
                      key={q.id}
                      id={q.id} // GUID
                      questionNumber={q.questionNumber}
                      question={q.questionText}
                      options={q.options}
                      onAnswerChange={(qId, ans) => onAnswerChange(qId, ans)}
                    />
                  ))}
                </div>
              );
            }

            // --- 3. SHORT ANSWER (Đã sửa) ---
            if (
              questionType === "short_answer" ||
              questionType === "sentence_completion"
            ) {
              return (
                <ListeningShortAnswer
                  key={section.id}
                  sectionId={section.id} // GUID
                  instruction={section.instructions}
                  questions={section.questions.map((q) => ({
                    id: q.id,
                    questionNumber: q.questionNumber,
                    questionText: q.questionText,
                    wordLimit: section.wordLimit,
                  }))}
                  onAnswerChange={(qId, ans) => onAnswerChange(qId, ans)}
                />
              );
            }

            // --- 4. MULTIPLE ANSWER (Pick 2/5) ---
            if (questionType === "multiple_answers") {
              return (
                <div key={section.id} className="space-y-6">
                  {section.questions.map((q) => (
                    <ListeningMultipleAnswer
                      key={q.id}
                      id={q.id}
                      question={q.questionText}
                      instruction={section.instructions}
                      options={q.options || []}
                      maxAnswers={section.maxAnswers || 2}
                      onAnswerChange={(qId, ans) => onAnswerChange(qId, ans)}
                    />
                  ))}
                </div>
              );
            }

            // --- 5. DIAGRAM / MAP ---
            if (
              questionType === "map_labeling" ||
              questionType === "diagram_labeling"
            ) {
              return (
                <ListeningMapLabeling
                  key={section.id}
                  sectionId={section.id}
                  title={section.sectionTitle}
                  instruction={section.instructions}
                  mapImageUrl={"http://localhost:5151/" + section.mapImageUrl}
                  questions={section.questions}
                  onAnswerChange={(qId, ans) => onAnswerChange(qId, ans)}
                />
              );
            }

            // --- FALLBACK ---
            return (
              <div
                key={section.id}
                className="p-4 border border-red-200 bg-red-50 text-red-600 rounded"
              >
                Unknown type: {questionType}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ListeningRenderer;
