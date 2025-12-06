"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Settings, Flag } from "lucide-react";

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

import { ListeningPart, ListeningSection } from "@/types/listening";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import FullScreenButton from "./ui/fullscreen";
import { IoIosSettings } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import { Button } from "react-day-picker";

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
      {/* --- HEADER (Navbar) --- */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm h-[72px]">
        <div className="h-full px-4 flex items-center justify-between gap-4 container mx-auto">
          
          {/* LEFT: Back & Title */}
          <div className="flex items-center gap-3 w-[200px]">
            <Link 
              href="/tests" 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-gray-800 text-sm">IELTS Listening</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FileText className="w-3 h-3" />
                <span>Part {listeningData.partNumber}</span>
              </div>
            </div>
          </div>

          {/* CENTER: Audio Player */}
          <div className="flex-1 flex justify-center max-w-xl">
            {currentAudioSrc ? (
               <CustomAudioPlayer src={"http://localhost:5151/"+currentAudioSrc} />
            ) : (
               <div className="text-sm text-red-400 italic">No audio source</div>
            )}
          </div>

          {/* RIGHT: Timer & Tools */}
          <div className="flex space-x-8 justify-self-start">
            <div className="hidden md:block transform scale-90"> 
               <IELTSTimer className="flex-row !gap-0 " />
            </div>

            <div className="flex items-center justify-center rounded-2xl shadow-2xl bg-gray-100 px-5 py-3 hover:bg-gray-200 transition-all duration-300">
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="flex space-x-5 text-sm">
                  <NavigationMenuItem>
                    <FullScreenButton />
                  </NavigationMenuItem>
                  <NavigationMenuList className="flex gap-2">
                    <NavigationMenuItem>
                      <IoIosSettings className="text-2xl" />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <IoExit
                        className="text-2xl cursor-pointer"
                        
                      />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button
                        className="rounded-3xl bg-[#407db9] hover:bg-[#336699] transition-all duration-300"
                      >
                        Submit
                      </Button>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-4xl mx-auto p-6 pb-24">
        
        {/* Part Info */}
        <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            {listeningData.partTitle || `Part ${listeningData.partNumber}`}
          </h1>
          <p className="text-blue-700 italic text-sm">{listeningData.context}</p>
          <div className="mt-4 inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 border border-blue-200 shadow-sm">
             Questions {listeningData.questionRange}
          </div>
        </div>

        {/* SECTIONS LOOP */}
        <div className="space-y-12">
          {listeningData.sections.map((section) => {
            const { questionType } = section;

            // --- 1. FORM COMPLETION ---
            if (questionType === "form_completion" || questionType === "note_completion") {
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
                  <h3 className="font-bold text-gray-700 border-b pb-2">{section.sectionTitle}</h3>
                  
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
            if (questionType === "short_answer" || questionType === "sentence_completion") {
              return (
                <ListeningShortAnswer
                  key={section.id}
                  sectionId={section.id} // GUID
                  instruction={section.instructions}
                  questions={section.questions.map(q => ({
                      id: q.id,
                      questionNumber: q.questionNumber,
                      questionText: q.questionText,
                      wordLimit: section.wordLimit
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
            if (questionType === "map_labeling" || questionType === "diagram_labeling") {
               return (
                 <ListeningMapLabeling 
                    key={section.id}
                    sectionId={section.id}
                    title={section.sectionTitle}
                    instruction={section.instructions}
                    mapImageUrl={"http://localhost:5151/"+section.mapImageUrl}
                    questions={section.questions}
                    onAnswerChange={(qId, ans) => onAnswerChange(qId, ans)}
                 />
               )
            }

            // --- FALLBACK ---
            return (
                <div key={section.id} className="p-4 border border-red-200 bg-red-50 text-red-600 rounded">
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