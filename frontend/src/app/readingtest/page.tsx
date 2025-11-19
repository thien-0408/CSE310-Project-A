"use client";
import { useRef, useState, FC, useMemo } from "react"; 
import data from "@/data/readingquestion.json";
import QuestionRenderer from "@/components/QuestionRenderer";
import QuestionScoring from "@/components/QuestionScoring";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { IoExit } from "react-icons/io5";
import Image from "next/image";
import FullScreenButton from "@/components/ui/fullscreen";
import { Button } from "@/components/ui/button";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import Loader from "@/components/ui/Loader";
import TextHighlighter from "@/components/ui/highlighter";
import IELTSCountdownTimer from "@/components/ui/coutdownTimer";
import { IoIosSettings } from "react-icons/io";
import { useRouter } from "next/navigation";
import type { ReadingData } from "@/types/reading";
import ReadingPassage from "@/components/readingpassage";

// Interface for user answers
interface UserAnswer {
  questionId: number;
  answer: unknown;
}

export default function ReadingTest() {
  //Confirm modal
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps>({
    isVisible: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isVisible: boolean;
  }
  const handleExit = () => {
    setConfirmModal({
      isVisible: true,
      message: "Are you sure you want to drop the test?",
      onConfirm: () => {
        setExit(true);
        router.push("/tests");
      },
      onCancel: () =>
        setConfirmModal({
          isVisible: false,
          message: "",
          onConfirm: () => {},
          onCancel: () => {},
        }),
    });
  };
  const ConfirmModal: FC<ConfirmModalProps> = ({
    message,
    onConfirm,
    onCancel,
    isVisible,
  }) => {
    if (!isVisible) return null;

    return (
      <div data-aos = "fade" data-aos-duration="300" className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 backdrop-blur-sm transition-opacity duration-300">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
          <p className="text-center text-gray-700 mb-6 text-lg">{message}</p>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button
              className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  const [isExit, setExit] = useState(false);
  const router = useRouter();
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showScoring, setShowScoring] = useState(false);

  const readingData = data as ReadingData;
  const allQuestions = useMemo(() => {
    return readingData.sections.flatMap((section) => section.questions);
  }, [readingData.sections]);

  const totalQuestions = allQuestions.length;
  //Update user answer function
  const handleAnswerChange = (questionId: number, answer: unknown) => {
    setUserAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (a) => a.questionId === questionId
      );
      if (existingAnswerIndex !== -1) {
        // Update existing answer
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { questionId, answer };
        return updatedAnswers;
      } else {
        // Add new answer
        return [...prevAnswers, { questionId, answer }];
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

  // const handleSubmit = () => {
  //   setShowResults(true);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };
  
  const handleSubmit = () => {
    setShowScoring(true);
    setConfirmModal({ ...confirmModal, isVisible: false });
  };
  if(isExit){
    return(
      <>
      <Loader></Loader>
      </>
    )
  }
 if (showScoring) {
    return (
      <>
      <Loader></Loader>
      
          <QuestionScoring
            sections={readingData.sections}
            userAnswers={userAnswers}
            onClose={() => setShowScoring(false)}
          />
      
      </>
    );
  }
  

  return (
    <>
      {/*Nav bar */}
      <ConfirmModal
        isVisible={confirmModal.isVisible}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />
      <header className="w-full bg-white shadow-sm border-b top-0 z-9 sticky">
        <div className="mx-auto px-4 py-3">
          <div className="grid grid-cols-3 items-center">
            {/*Left group*/}
            <div className="flex items-center space-x-8 justify-self-start">
              <div className="flex items-center">
              </div>
            </div>

            {/*Middle group*/}
            <div className="justify-self-center">
              <IELTSCountdownTimer minutes={readingData.testDuration}></IELTSCountdownTimer>
            </div>

            {/* Right group*/}
            <div className="flex items-center justify-self-end rounded-2xl shadow-2xl bg-gray-100 px-5 py-3 hover:bg-gray-200 transition-all duration-300">
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="flex space-x-5 text-sm">
                  <NavigationMenuItem>
                    <FullScreenButton></FullScreenButton>
                  </NavigationMenuItem>

                  <NavigationMenuList className="flex gap-2">
                    <NavigationMenuItem>
                      <IoIosSettings className="text-2xl" />
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <IoExit className="text-2xl" onClick={handleExit} />
                    </NavigationMenuItem>
                  </NavigationMenuList>
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
          
          <div className="p-6 px-15 text-md">
            <Image
              src={"/testdata/repImage/DSC06942-1-1536x1024-1.jpg"}
              alt="Coral Reefs"
              width={200}
              height={200}
              quality={100}
              className="mb-2"
            ></Image>
            <ReadingPassage
            id={readingData.partNumber}
            title={readingData.passageTitle}
            text={""}
          />
            <TextHighlighter
              content={data.text}
              passageId={""}
            ></TextHighlighter>
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
            <h3 className="text-xl font-semibold text-[#2c76c0]">
              Questions {readingData.questionRange}
            </h3>
          </div>

          <QuestionRenderer
            sections={readingData.sections}
            onAnswerChange={handleAnswerChange}
          />
        </div>
      </div>
      <footer className="sticky bottom-0 w-full bg-white shadow-inner border-t p-3 flex items-center justify-center space-x-5">
        <div>
          <h3 className="text-gray-800 text-md">
            Question {userAnswers.length} of {totalQuestions}
          </h3>
        </div>
        <div>
          <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300">
            <GrPrevious />
          </Button>
        </div>
        <div>
          <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300">
            <GrNext></GrNext>
          </Button>
        </div>
        <div>
          <Button
            className="rounded-3xl bg-[#407db9] hover:bg-[#336699] transition-all duration-300"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </footer>
    </>
  );
}
