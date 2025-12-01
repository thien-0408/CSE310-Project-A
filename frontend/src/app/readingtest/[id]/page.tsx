"use client";
import { useRef, useState, FC, useMemo, useEffect } from "react";
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
import { useRouter, useParams } from "next/navigation";
import type {
  ReadingData,
  ReadingTestResponse,
} from "@/types/ReadingInterfaces";
import { calculateReadingScore } from "@/utils/readingScoringUtils";

// --- UTILITY FOR SCORING (Inline or imported) ---
// You should ideally move this to utils/readingScoringUtils.ts
interface UserAnswer {
  questionId: string;
  answer: unknown;
}

export default function ReadingTest() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;
  const hasFetched = useRef(false);
  const [readingData, setReadingData] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataResponse, setDataResponse] = useState<ReadingTestResponse | null>(
    null
  );

  // --- LOGIC FETCH API ---
  useEffect(() => {
    if (!testId) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchTest = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `http://localhost:5151/api/reading-test/${testId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) throw new Error("Test not found");
          throw new Error("Failed to fetch test data");
        }

        const testData: ReadingTestResponse = await response.json();
        setDataResponse(testData);

        console.log("Fetched Test Data:", testData);

        if (testData && testData.parts && testData.parts.length > 0) {
          setReadingData(testData.parts[0]);
          try {
            const token = localStorage.getItem("accessToken");

            if (token) {
              const attemptResponse = await fetch(
                `http://localhost:5151/api/user/attempt-test/${testId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (attemptResponse.ok) {
                const attemptData = await attemptResponse.json();
                if (attemptData && attemptData.id) {
                  localStorage.setItem("currentResultId", attemptData.id);
                  console.log("Attempt id:", attemptData.id);
                }
              } else {
                console.warn(
                  "Failed to record test attempt:",
                  attemptResponse.statusText
                );
              }
            } else {
              console.warn("No access token found. User might be guest.");
            }
          } catch (attemptError) {
            console.error("Error calling attempt-test API:", attemptError);
          }
        } else {
          setError("Test data is empty or invalid structure");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || "Error loading test data");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  //Confirm modal logic
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

  // --- HANDLE EXIT (DROP TEST) ---
  const handleExit = () => {
    setConfirmModal({
      isVisible: true,
      message: "Are you sure you want to drop the test?",
      onConfirm: async () => {
        try {
          const resultId = localStorage.getItem("currentResultId");
          const token = localStorage.getItem("accessToken");

          if (!resultId || !token) {
            console.error("Missing Data:", { resultId, hasToken: !!token });
          } else {
            console.log("alling API Drop Test with ID:", resultId);
            
            const response = await fetch(
              `http://localhost:5151/api/user/drop-test/${resultId}`, 
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(response.status);

            if (response.ok) {
              console.log("✅ Drop Test Success!");
              localStorage.removeItem("currentResultId"); 
            } else {
              const errorText = await response.text();
              console.error("Drop Test Failed:", errorText);
            }
          }
        } catch (e) {
          console.error("Network/Code Error:", e);
        }
        setExit(true);
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
      <div
        data-aos="fade"
        data-aos-duration="300"
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 backdrop-blur-sm transition-opacity duration-300"
      >
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
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showScoring, setShowScoring] = useState(false);

  const allQuestions = useMemo(() => {
    if (!readingData) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return readingData.sections.flatMap((section: any) => section.questions);
  }, [readingData]);

  const totalQuestions = allQuestions.length;

  const handleAnswerChange = (questionId: string, answer: unknown) => {
    setUserAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (a) => a.questionId === questionId
      );
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { questionId, answer };
        return updatedAnswers;
      } else {
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
    if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  // --- HANDLE SUBMIT TEST ---
  const handleSubmit = async () => {
    // 1. Calculate Score Client-side
    if (readingData) {
        // Hàm tính điểm (đã có ở trên)
        const resultStats = calculateReadingScore(readingData.sections, userAnswers);
        console.log("Calculated Accuracy:", resultStats.accuracy); // Log để debug

        try {
            const resultId = localStorage.getItem("currentResultId");
            const token = localStorage.getItem("accessToken");
            
            if (!resultId) {
                console.warn("No Result ID found to submit.");
            }

            if (resultId && token) {
                const response = await fetch(
                    `http://localhost:5151/api/user/submit-test/${resultId}?accuracy=${resultStats.accuracy}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log("Submit success:", data);
                    localStorage.removeItem("currentResultId"); 
                } else {
                    console.error("Submit failed with status:", response.status);
                    const errorText = await response.text();
                    console.error("Error details:", errorText);
                }
            }
        } catch (e) {
            console.error("Network error submitting test:", e);
        }
    }

    setShowScoring(true);
    setConfirmModal({ ...confirmModal, isVisible: false });
  };

  if (isExit) return <Loader />;

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error || !readingData)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-xl">{error || "Data not found"}</p>
        <Button onClick={() => router.push("/tests")}>Back to Test Bank</Button>
      </div>
    );

  if (showScoring) {
    return (
      <>
        {/* You might want to remove <Loader> here or use a better loading state if needed */}
        <QuestionScoring
          sections={readingData.sections}
          // Assuming QuestionScoring expects UserAnswer[], which it does
          userAnswers={userAnswers}
          onClose={() => setShowScoring(false)}
        />
      </>
    );
  }

  return (
    <>
      <ConfirmModal
        isVisible={confirmModal.isVisible}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />

      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b top-0 z-9 sticky">
        <div className="mx-auto px-4 py-3">
          <div className="grid grid-cols-3 items-center">
            <div className="flex items-center space-x-8 justify-self-start">
              <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300">
                <GrPrevious />
              </Button>

              <h3 className="text-gray-800 text-md">
                Question {userAnswers.length} of {totalQuestions}
              </h3>
              <Button className="rounded-4xl bg-gray-200 text-gray-800 hover:bg-gray-300">
                <GrNext />
              </Button>
            </div>

            <div className="justify-self-center">
              <IELTSCountdownTimer />
            </div>

            <div className="flex items-center justify-self-end rounded-2xl shadow-2xl bg-gray-100 px-5 py-3 hover:bg-gray-200 transition-all duration-300">
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
                        onClick={handleExit}
                      />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Button
                        className="rounded-3xl bg-[#407db9] hover:bg-[#336699] transition-all duration-300"
                        onClick={handleSubmit}
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

      {/* Main Content */}
      <div className="flex h-screen overflow-hidden font-roboto">
        {/* Passage Column */}
        <div
          className="overflow-y-auto border-r"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="p-6 px-15 text-md">
            <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6 group">
              <Image
                src={
                  "http://localhost:5151" + dataResponse?.imageUrl ||
                  "/testdata/repImage/DSC06942-1-1536x1024-1.jpg"
                }
                sizes=""
                alt="Reading Background"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Title lies on image*/}
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <span className="inline-block px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded mb-2">
                  READING
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug shadow-black drop-shadow-md">
                  {dataResponse?.title}
                </h2>
              </div>
            </div>
            <TextHighlighter
              content={readingData.text}
              passageId={readingData.partId}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-500"
        ></div>

        {/* Questions Column */}
        <div className="flex-1 overflow-y-auto p-6">
          <QuestionRenderer
            sections={readingData.sections}
            onAnswerChange={handleAnswerChange}
          />
        </div>
      </div>
    </>
  );
}