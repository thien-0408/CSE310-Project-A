"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import ListeningRenderer from "@/components/AudioRenderer";
import ListeningScoring from "@/components/ListeningScoring";
import { ListeningTestResponse, UserAnswer } from "@/types/listening";
import { calculateListeningScore } from "@/utils/listeningScoringUtils";
// Modal Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConfirmModal = ({ isVisible, message, onConfirm, onCancel }: any) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 animate-in zoom-in-95">
        <p className="text-center text-gray-800 font-medium mb-6 text-lg">
          {message}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ListeningTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  // State
  const [testData, setTestData] = useState<ListeningTestResponse | null>(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScoring, setShowScoring] = useState(false);

  // Modal & Logic State
  const [modal, setModal] = useState({
    show: false,
    message: "",
    type: "exit",
  });
  const attemptRef = useRef(false);

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
        const data = await resTest.json();
        setTestData(data);

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
              localStorage.setItem("currentResultId", attemptData.id);
              console.log("Attempt started:", attemptData.id);
            }
          } catch (e) {
            console.error("Attempt failed", e);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    initTest();
  }, [testId]);

  // --- HANDLERS ---
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

  // Submit Test
  const handleSubmitConfirm = async () => {
    setModal({ ...modal, show: false });

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

      console.log(
        `Result: ${grandTotalScore}/${grandTotalQuestions} = ${accuracyPercent}%`
      );

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
      console.error(e);
    }
  };

  // Drop Test (Exit)
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
      localStorage.removeItem("currentResultId");
    }
    router.push("/tests");
  };

  // Navigation
  const handleNextPart = () => {
    if (testData && currentPartIndex < testData.parts.length - 1) {
      setCurrentPartIndex((p) => p + 1);
      window.scrollTo(0, 0);
    } else {
      setModal({ show: true, message: "Submit your test?", type: "submit" });
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error || !testData)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  // --- VIEW RESULT ---
  if (showScoring) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
          Results
        </h1>
        <div className="max-w-5xl mx-auto space-y-8">
          {testData.parts.map((part) => (
            <div key={part.id}>
              <h2 className="text-xl font-bold mb-3 px-2 text-gray-700">
                Part {part.partNumber}
              </h2>
              <ListeningScoring
                listeningData={part}
                userAnswers={userAnswers}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-12 pb-10">
          <button
            onClick={() => router.push("/tests")}
            className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black shadow-lg"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const currentPart = testData.parts[currentPartIndex];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ConfirmModal
        isVisible={modal.show}
        message={modal.message}
        onConfirm={
          modal.type === "submit" ? handleSubmitConfirm : handleExitConfirm
        }
        onCancel={() => setModal({ ...modal, show: false })}
      />

      {/* Nút Exit */}
      <div className="fixed ">
        <button
          onClick={() =>
            setModal({
              show: true,
              message: "Quit test? Progress will be lost.",
              type: "exit",
            })
          }
          className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold hover:bg-red-200"
        >
          Exit
        </button>
      </div>

      {currentPart && (
        <ListeningRenderer
          listeningData={currentPart}
          audioUrl={testData.audioUrl || undefined}
          onAnswerChange={(qId, ans) => handleAnswerChange(String(qId), ans)}
        />
      )}

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
