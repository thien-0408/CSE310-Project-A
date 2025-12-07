"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import ListeningRenderer from "@/components/AudioRenderer";
import ListeningScoring from "@/components/ListeningScoring";
import { ListeningTestResponse, UserAnswer } from "@/types/listening";
import { calculateListeningScore } from "@/utils/listeningScoringUtils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, Home, LogOut } from "lucide-react";
import Link from "next/link";
import FullScreenButton from "@/components/ui/fullscreen";
import IELTSTimer from "@/components/ui/coutdownTimer";
import CustomAudioPlayer from "@/components/ui/CustomAudioPlayer";
import ConfirmModal, { ConfirmStatus } from "@/components/ui/ConfirmModal";

export default function ListeningTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  // State
  const [testData, setTestData] = useState<ListeningTestResponse | null>(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScoring, setShowScoring] = useState(false);
  // Modal & Logic State
  const attemptRef = useRef(false);
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

  // --- INIT DATA & ATTEMPT ---
  useEffect(() => {
    if (!testId) return;

    const initTest = async () => {
      try {
        setLoading(true);
        setError("");
        const resTest = await fetch(
          `http://localhost:5151/api/listening/get-test/${testId}`
        );
        if (!resTest.ok) throw new Error("Failed to load test");
        if (resTest.ok) {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          const data = await resTest.json();
          setTestData(data);
          console.log(data);
        }
        const token = localStorage.getItem("accessToken");
        if (token && !attemptRef.current) {
          attemptRef.current = true;
          try {
            const resAttempt = await fetch(
              `http://localhost:5151/api/user/attempt-test/${testId}`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (resAttempt.ok) {
              const attemptData = await resAttempt.json();
              setModalConfig((prev) => ({ ...prev, isOpen: false }));
              localStorage.setItem("currentResultId", attemptData.id);
            }
          } catch (e) {
            console.error("Attempt failed", e);
            setModalConfig((prev) => ({ ...prev, isOpen: false }));
          }
        }
      } catch (err) {
        console.log(err);
        setError("Some errors occured");
      } finally {
        setLoading(false);
      }
    };

    initTest();
  }, [testId]);

  const handleAnswerChange = (qId: string, ans: unknown) => {
    setUserAnswers((prev) => {
      const idx = prev.findIndex((a) => a.questionId === qId);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { questionId: qId, answer: ans };
        return updated;
      }
      return [...prev, { questionId: qId, answer: ans }];
    });
  };

  const handleSubmitConfirm = async () => {
    try {
      let grandTotalScore = 0;
      let grandTotalQuestions = 0;

      if (testData) {
        testData.parts.forEach((part) => {
          const result = calculateListeningScore(part, userAnswers);
          grandTotalScore += result.totalScore;
          grandTotalQuestions += result.totalQuestions;
        });
      }

      const accuracyPercent =
        grandTotalQuestions > 0
          ? Math.round((grandTotalScore / grandTotalQuestions) * 100)
          : 0;

      const resultId = localStorage.getItem("currentResultId");
      const token = localStorage.getItem("accessToken");

      if (resultId && token) {
        await fetch(
          `http://localhost:5151/api/user/submit-test/${resultId}?accuracy=${accuracyPercent}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.removeItem("currentResultId");
      }
      setShowScoring(true);
    } catch (e) {
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
      console.error(e);
    }
  };
  const handleSubmit = () => {
    setModalConfig({
      isOpen: true,
      status: "ask",
      title: "Submit the test?",
      message:
        "Are you sure you want to submit your test? You cannot edit it after submission.",
      onConfirm: async () => {
        handleSubmitConfirm();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleExitConfirm = async () => {
    const resultId = localStorage.getItem("currentResultId");
    const token = localStorage.getItem("accessToken");
    if (resultId && token) {
      await fetch(
        `http://localhost:5151/api/reading-test/drop-test/${resultId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalConfig((prev) => ({ ...prev, isOpen: false }));

      localStorage.removeItem("currentResultId");
    }
    router.push("/tests");
  };
  const handleExit = () => {
    setModalConfig({
      isOpen: true,
      status: "warning",
      title: "Leave the test?",
      message:
        "You have unsaved progress. If you leave now, your task will be lost",
      onConfirm: async () => {
        handleExitConfirm();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleNextPart = () => {
    if (testData && currentPartIndex < testData.parts.length - 1) {
      setCurrentPartIndex((p) => p + 1);
      window.scrollTo(0, 0);
    } else {
      //set modal
    }
  };

  // Render Logic
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error || !testData)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  if (showScoring) {
    // Giữ nguyên phần hiển thị kết quả
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-8">
          {testData.parts.map((part) => (
            <div key={part.id}>
              <ListeningScoring
                listeningData={part}
                userAnswers={userAnswers}
              />
            </div>
          ))}
        </div>
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
      </div>
    );
  }
  const currentPart = testData.parts[currentPartIndex];
  const currentAudioSrc = currentPart?.partAudioUrl || "";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
      <header className="sticky top-0 z-50 w-full h-[72px] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 shadow-sm">
        <div className="relative mx-auto h-full px-4 flex items-center justify-between gap-4">
          {/* LEFT: BACK & INFO */}
          <div className="flex items-center gap-3 min-w-fit z-10 relative">
            <Link
              href="/tests"
              className="flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div className="hidden sm:flex flex-col">
              <h1 className="font-bold text-slate-800 text-sm leading-tight">
                IELTS Listening
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] border border-blue-100 uppercase tracking-wider">
                  {/* Hiển thị số Part động */}
                  Part {currentPart?.partNumber}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: AUDIO PLAYER */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 flex justify-center">
            {currentAudioSrc ? (
              <div className="w-full shadow-sm rounded-full overflow-hidden border border-slate-100 bg-white px-5">
                {/* Truyền src vào CustomAudioPlayer */}
                <CustomAudioPlayer
                  src={"http://localhost:5151/" + currentAudioSrc}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Missing Audio Source
              </div>
            )}
          </div>

          {/* RIGHT: TOOLS */}
          <div className="flex items-center gap-3 min-w-fit z-10 relative">
            {/* ... Giữ nguyên phần Timer và Buttons ... */}
            <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg ">
              <IELTSTimer className="!gap-2 text-slate-700 font-mono font-bold" />
            </div>
            <div className="hidden md:block h-6 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-1">
              <FullScreenButton />
              <Button
                variant="ghost"
                size="icon"
                //set modal
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                onClick={handleExit}
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <Button
                //set modal
                onClick={handleSubmit}
                className="ml-2 rounded-full bg-[#407db9] hover:bg-[#336699] text-white px-6 shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MODAL & RENDERER */}
      {currentPart && (
        <ListeningRenderer
          listeningData={currentPart}
          onAnswerChange={(qId, ans) => handleAnswerChange(String(qId), ans)}
        />
      )}
      {/* FOOTER NAVIGATION (Giữ nguyên) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="container mx-auto max-w-5xl flex justify-between items-center">
          <button
            onClick={() => setCurrentPartIndex((p) => Math.max(0, p - 1))}
            disabled={currentPartIndex === 0}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous Part
          </button>
          <span className="text-sm font-bold text-gray-500">
            Part {currentPartIndex + 1} / {testData.parts.length}
          </span>
          <button
            onClick={handleNextPart}
            className={`px-6 py-2.5 rounded-lg text-white font-bold shadow-md ${
              currentPartIndex === testData.parts.length - 1
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {currentPartIndex === testData.parts.length - 1
              ? "Finish"
              : "Next Part"}
          </button>
        </div>
      </div>
    </div>
  );
}
