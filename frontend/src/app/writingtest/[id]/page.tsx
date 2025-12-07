"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  Clock,
  AlignLeft,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Hourglass,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/Loader";
import ConfirmModal, { ConfirmStatus } from "@/components/ui/ConfirmModal";
import FullScreenButton from "@/components/ui/fullscreen";
import Link from "next/link";


// --- Interfaces ---
interface WritingTest {
  id: string;
  title: string;
  topic: string;
  skill: string;
  subtitle: string;
  imageUrl: string | null;
  duration: number;
  testType: string;
  createdAt: string;
  submissions: unknown[];
}

export default function WritingTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  // --- State ---
  const [testData, setTestData] = useState<WritingTest | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

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

  // --- Fetch Logic ---
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://localhost:5151/api/writing-test/get-test/${testId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data: WritingTest = await response.json();
          setTestData(data);
          setTimeLeft(data.duration * 60);
        } else {
          console.error("Failed to load test");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchTest();
  }, [testId]);

  // --- Timer Logic ---
  useEffect(() => {
    if (!testData || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, testData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- Helpers ---
  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

  const getTimerColor = () => {
    const totalTime = testData ? testData.duration * 60 : 1;
    const timeProgress = (timeLeft / totalTime) * 100;
    if (timeProgress > 50)
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (timeProgress > 20) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200 animate-pulse";
  };

  // --- MODAL HANDLERS ---

  const handleExit = () => {
    if (content.length > 0) {
      setModalConfig({
        isOpen: true,
        status: "warning",
        title: "Quit Assessment?",
        message:
          "You have unsaved progress. If you leave now, your essay will be lost.",
        onConfirm: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          router.push("/tests");
        },
      });
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    setModalConfig({
      isOpen: true,
      status: "ask",
      title: "Submit Essay",
      message:
        "Are you sure you want to submit your essay? You cannot edit it after submission.",
      onConfirm: async () => {
        await submitProcess();
      },
    });
  };

  const handleAutoSubmit = async () => {
    setModalConfig({
      isOpen: true,
      status: "alert",
      title: "Time's Up!",
      message:
        "The time limit has been reached. Your essay is being submitted automatically.",
      onConfirm: async () => {
        await submitProcess();
      },
    });
    setTimeout(() => submitProcess(), 2000);
  };

  // --- API Logic ---
  const submitProcess = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5151/api/writing-test/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            testId: testId,
            content: content,
            wordCount: wordCount,
          }),
        }
      );

      if (response.ok) {
        // Đóng modal và chuyển hướng
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        router.push("/tests");
      } else {
        alert("Submission failed. Please try again.");
        setIsSubmitting(false);
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    } catch (error) {
      console.error("Submit error:", error);
      setIsSubmitting(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  if (!testData)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 font-bold bg-slate-50">
        Test not found
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F8] font-sans overflow-hidden">
      {/* Component Modal */}
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

      {/* --- HEADER --- */}
      <header className="relative flex-shrink-0 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
          {" "}
          <Link
              href="/tests"
              className="flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 text-[10px] px-2 h-5 flex-shrink-0"
              >
                {testData.testType}
              </Badge>
              {testData.subtitle && (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0 border border-slate-200">
                  {testData.subtitle}
                </span>
              )}
            </div>
            <h1
              className="font-bold text-slate-800 text-sm md:text-base truncate max-w-xs md:max-w-md "
              title={testData.title}
            >
              {testData.title}
            </h1>
          </div>
        </div>

        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm font-mono font-bold transition-all duration-500 bg-white/90 backdrop-blur-sm z-10 ${getTimerColor()}`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-lg tracking-widest">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end min-w-fit ml-4">
          {" "}
          <FullScreenButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExit}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Exit Test"
          >
            <LogOut className="w-5 h-5" />
          </Button>
          <Button
            className="ml-2 rounded-full bg-[#407db9] hover:bg-[#336699] transition-all duration-300 px-6 shadow-sm"
            onClick={handleSubmit}
            disabled={isSubmitting || wordCount === 0}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </span>
            ) : (
              <span className="font-medium">Submit</span>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* === LEFT CARD: Prompt === */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate max-w-none mb-8">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <AlignLeft className="w-5 h-5 text-slate-400" /> Topic
                </h3>
                <div className="p-6  bg-slate-50 rounded-2xl border border-slate-100 text-slate-800 text-base leading-relaxed font-medium whitespace-pre-line shadow-inner">
                  {testData.topic}
                </div>
              </div>

              <div className="mb-6 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-700">
                  <p className="font-semibold text-blue-800 mb-1">
                    Instructions
                  </p>
                  <p>
                    You should spend about{" "}
                    <strong>{testData.duration} minutes</strong> on this task.
                  </p>
                </div>
              </div>

              {testData.imageUrl && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Reference Material
                  </h3>
                  <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm group">
                    <div className="aspect-video relative w-full">
                      <Image
                        src={`http://localhost:5151${testData.imageUrl}`}
                        alt="Task Prompt"

                        fill
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* === RIGHT CARD: Editor === */}
          <div className="flex flex-col h-full bg-white rounded-3xl shadow-lg shadow-blue-100/50 border border-slate-200 overflow-hidden relative">
            <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center z-10">
              <span className="font-semibold text-slate-500 text-sm uppercase tracking-wider">
                Your Response
              </span>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                    wordCount < 150
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}
                >
                  <span className="text-lg font-mono">{wordCount}</span>
                  <span className="opacity-80 font-sans">words</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative bg-white">
              <Textarea
                placeholder="Start typing your essay here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full p-6 lg:p-8 resize-none border-none focus:ring-0 text-lg leading-loose text-slate-700 placeholder:text-slate-300 font-serif"
                style={{ fontFamily: '"Merriweather", "Georgia", serif' }}
                spellCheck={false}
              />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            <div className="flex-shrink-0 p-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => setContent("")}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
}
