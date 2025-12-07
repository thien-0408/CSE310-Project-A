"use client";
import { useRef, useState, useMemo, useEffect } from "react";
import QuestionRenderer from "@/components/QuestionRenderer";
import QuestionScoring from "@/components/QuestionScoring";
import Image from "next/image";
import FullScreenButton from "@/components/ui/fullscreen";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import TextHighlighter from "@/components/ui/highlighter";
import IELTSCountdownTimer from "@/components/ui/coutdownTimer";
import { useRouter, useParams } from "next/navigation";
import type {
  ReadingData,
  ReadingTestResponse,
} from "@/types/ReadingInterfaces";
import { calculateReadingScore } from "@/utils/readingScoringUtils";
import { ChevronLeft, Eye, Home, LogOut } from "lucide-react";
import ConfirmModal, { ConfirmStatus } from "@/components/ui/ConfirmModal";
import Link from "next/link";
// --- UTILITY FOR SCORING (Inline or imported) ---
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dataResponse, setDataResponse] = useState<ReadingTestResponse | null>(
    null
  );
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    status: ConfirmStatus;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    status: "ask",
    title: "",
    message: "",
    onConfirm: () => {},
  });
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
  const handleExit = () => {
    setModalConfig({
      isOpen: true,
      status: "warning",
      title: "Quit Assesment?",
      message:
        "Are you sure you want to drop the test? If you leave now, your task will be marked as undone",
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
              console.log("Drop Test Success!");
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
        window.location.href = "/tests";
      },
    });
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
  const handleBackToTest = () => {
    window.location.href = "/tests";
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

  const handleSubmit = () => {
    setModalConfig({
      isOpen: true,
      status: "ask",
      title: "Submit Reading Test",
      message:
        "Are you sure you want to submit your test? You cannot edit it after submission.",
      onConfirm: async () => {
        await submitProcess();
      },
    });
  };
  // --- HANDLE SUBMIT TEST ---
  const submitProcess = async () => {
    if (readingData) {
      const resultStats = calculateReadingScore(
        readingData.sections,
        userAnswers
      );
      console.log("Calculated Accuracy:", resultStats.accuracy);

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
            setModalConfig((prev) => ({ ...prev, isOpen: false }));
          } else {
            console.error("Submit failed with status:", response.status);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            setModalConfig((prev) => ({ ...prev, isOpen: false }));
          }
        }
      } catch (e) {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        console.error("Network error submitting test:", e);
      }
    }
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    setShowScoring(true);
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
        <Loader></Loader>
        <QuestionScoring
          sections={readingData.sections}
          userAnswers={userAnswers}
          onClose={() => setShowScoring(false)}
        />
        <div className="text-center flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/tests")}
            className="px-6 py-3 bg-[#407db9] text-white rounded-full font-bold hover:bg-[#336699] shadow-md shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Library
          </button>
          <button
            onClick={() => setShowScoring(false)}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Review Test
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        isLoading={isSubmitting}
        confirmText={modalConfig.status === "alert" ? "Okay" : "Confirm"}
      />

      {/* Header */}
      <header className="sticky top-0 z-5 w-full h-[72px] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 shadow-sm">
        <div className="relative mx-auto h-full px-6 flex items-center justify-between">
          {/* --- LEFT: Back & Progress Info --- */}
          <div className="flex items-center gap-4 min-w-fit z-10 relative">
            <Link
              href="/tests"
              className="flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Progress
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-800 leading-none">
                  Question {userAnswers.length}
                </span>
                <span className="text-sm font-medium text-slate-400 leading-none">
                  / {totalQuestions}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <div className="flex items-center justify-center px-4 py-1.5 rounded-full ">
              <IELTSCountdownTimer />
            </div>
          </div>
          {/* --- RIGHT: Tools & Actions --- */}
          <div className="flex items-center gap-2 min-w-fit z-10 relative justify-end">
            <FullScreenButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExit}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <Button
              onClick={handleSubmit}
              className="rounded-full bg-[#407db9] hover:bg-[#336699] text-white px-6 shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              Submit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-screen overflow-hidden font-roboto">
        {/* Passage Column */}
        <div
          className="overflow-y-auto border-r custom-scrollbar"
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
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <QuestionRenderer
            sections={readingData.sections}
            onAnswerChange={handleAnswerChange}
          />
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </>
  );
}
