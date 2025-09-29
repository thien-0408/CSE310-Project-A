"use client";
import NavbarTest from "@/components/ui/navbarfortest";
import { useRef, useState } from "react";
import { useEffect } from "react";
import ReadingPassage from "@/components/readingpassage";
import data from "@/data/readingquestion.json";
import QuestionRenderer from "@/components/QuestionRenderer";
import QuestionScoring from "@/components/QuestionScoring";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import FullScreenButton from "@/components/ui/fullscreen";
import { Button } from "@/components/ui/button";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

// Interface for user answers
interface UserAnswer {
  questionId: number;
  answer: unknown;
}

export default function ReadingTest() {
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  //Update user answer function
  const handleAnswerChange = (questionId: number, answer: unknown) => {
    setUserAnswers(prev => {
      const existing = prev.find(ua => ua.questionId === questionId);
      if (existing) {
        // Update current answer
        return prev.map(ua => 
          ua.questionId === questionId 
            ? { ...ua, answer } 
            : ua
        );
      } else {
        // Add new answer
        return [...prev, { questionId, answer }];
      }
    });
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        span.className = "bg-yellow-300 font-bold";
        try {
          range.surroundContents(span);
        } catch (err) {
          console.warn("Can't highlight complex text!");
        }
        selection.removeAllRanges();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (showResults) {
    return (
      <>
        <NavbarTest />
        <QuestionScoring
          questions={data.questions}
          userAnswers={userAnswers}
          onClose={() => setShowResults(false)}
        />
      </>
    );
  }

  return (
    <>
      {/*Nav bar */}
      <header className="w-full bg-white shadow-sm border-b">
      <div className="mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            {/*Left group*/}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Image
                src="/assets/logo.png"
                alt="IELTSSprint Logo"
                width={30}
                height={30}
                quality={100}
                className="mr-2"
              />
              <h1 className="text-2xl font-bold italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
                <Link href={'/homepage'}>IELTSSprint</Link>
              </h1>
            </div>
          </div>
          {/* Right group */}
          <div className="flex items-center">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex space-x-5 text-sm">
                <NavigationMenuItem>
                  <FullScreenButton></FullScreenButton>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
      <div className="flex h-screen overflow-hidden font-roboto">
        {/* Passage */}
        <div
          className="overflow-y-auto border-r"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="text-3xl font-extrabold text-center p-10 text-white italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8]">
            <h1 className="title">{data.passageTitle}</h1>
          </div>
          <div className="p-6  px-15">
            
             <ReadingPassage
                key={data.passageId}
                id={data.passageId}
                title={data.passageTitle}
                text={data.text}
              />
          </div>
        </div>

        {/* Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-500"
        ></div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#2c76c0]">Questions {data.passageRange}</h3>
            
          </div>
          
          <QuestionRenderer 
            questions={data.questions} 
            onAnswerChange={handleAnswerChange}
          />
        </div>
      </div>
      <footer className="sticky bottom-0 w-full bg-white shadow-inner border-t p-3 flex items-center justify-center space-x-5">
        <div>
          <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300"><GrPrevious /></Button>
        </div>
        <div>
          <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300"><GrNext></GrNext></Button>
        </div>
        <div>
          <Button className="rounded-3xl bg-[#407db9] hover:bg-[#336699] transition-all duration-300" onClick={handleSubmit}>Submit</Button>
        </div>
      </footer>
    </>
  );
}