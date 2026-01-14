"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Clock, Lightbulb, ChevronRight, Volume2, RotateCcw, GraduationCap, Brain, Target, Zap, Check, Circle, Loader2 } from "lucide-react";
import NavBar from "@/components/ui/navbar";
import { ur } from "zod/v4/locales";

// --- Types & Data ---
type AcademicTopic = {
  id: string;
  category: "Science" | "Society" | "Technology" | "Environment";
  question: string;
  difficulty: "Advanced" | "Expert";
  timeLimit: number;
  keywords: string[];
};
const ASSESSMENT_CRITERIA = [
  { label: "Argumentation", score: 8.5, max: 9, color: "from-blue-500 to-cyan-500" },

  { label: "Academic Register", score: 8.0, max: 9, color: "from-violet-500 to-purple-500" },

  { label: "Complexity", score: 7.5, max: 9, color: "from-amber-500 to-orange-500" },

  { label: "Coherence", score: 8.5, max: 9, color: "from-emerald-500 to-teal-500" },
];

const ADVANCED_PHRASES = ["It is widely acknowledged that...", "From a theoretical perspective...", "Empirical evidence suggests...", "One cannot overlook the fact that..."];

const ACADEMIC_TOPICS: AcademicTopic[] = [
  {
    id: "1",
    category: "Science",
    question: "To what extent do you agree that artificial intelligence will fundamentally transform scientific research methodology in the next decade?",
    difficulty: "Expert",
    timeLimit: 120,
    keywords: ["methodology", "paradigm shift", "empirical evidence", "breakthrough"],
  },
  {
    id: "2",
    category: "Environment",
    question: "Evaluate the effectiveness of carbon pricing mechanisms as a tool for combating climate change.",
    difficulty: "Advanced",
    timeLimit: 90,
    keywords: ["market-based solution", "incentivize", "regulatory framework", "sustainable"],
  },
];

// --- Components ---
const WaveformVisualizer = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-end justify-center space-x-0.5 h-16">
    {[...Array(32)].map((_, i) => {
      const height = isActive ? Math.random() * 40 + 20 : 4;
      return <div key={i} className={`w-1 bg-linear-to-t from-indigo-600 to-indigo-400 rounded-full transition-all duration-150 ${isActive ? "opacity-100" : "opacity-30"}`} style={{ height: `${height}px` }} />;
    })}
  </div>
);

const AcademicSpeakingPage = () => {
  // --- States ---
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // --- Refs ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentTopic = ACADEMIC_TOPICS[currentTopicIndex];

  // --- Timer Logic ---
  useEffect(() => {
    // --- Khi bắt đầu ghi ---
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }

    // --- Khi dừng ghi ---
    if (!isRecording && audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/wav",
      });

      (async () => {
        try {
          setIsLoading(true);

          const result = await postAudioToBackend(audioBlob);
          console.log("Upload success:", result);

          setTranscript("Upload audio thành công!");
          setShowFeedback(true);
        } catch (error) {
          console.error(error);
          alert("Lỗi khi gửi audio lên backend");
        } finally {
          setIsLoading(false);
        }
      })();
    }

    // --- Cleanup ---
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  const formData = new FormData();

  // --- Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        formData.append("audio", audioBlob, "speech.wav");
        formData.append("question", currentTopic.question);
        console.log(url);
        await handleEvaluation(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowFeedback(false);
      setTranscript("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Vui lòng cấp quyền truy cập Micro!");
    }
  };
  const postAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "speech.wav");
    formData.append("question", "Test speaking upload from useEffect");

    const response = await fetch("https://localhost:5151/api/speaking/test-upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload audio failed");
    }

    return await response.json();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEvaluation = async (blob: Blob) => {
    setIsLoading(true);
    // Giả lập gọi API (Bạn sẽ thay bằng fetch('/api/evaluate') ở bước sau)
    setTimeout(() => {
      setTranscript("Your spoken response will appear here after AI analysis...");
      setShowFeedback(true);
      setIsLoading(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-stone-50 to-neutral-50">
      <NavBar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200/60 overflow-hidden">
              <div className="px-8 pt-8 pb-6 border-b border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold uppercase tracking-widest">{currentTopic.category}</div>
                    <div className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">{currentTopic.difficulty}</div>
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-light text-slate-900 leading-relaxed">{currentTopic.question}</h2>
              </div>

              <div className="p-8 bg-linear-to-b from-white to-slate-50/30">
                <WaveformVisualizer isActive={isRecording} />

                {/* Progress & Timer */}
                <div className="mt-8 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Response Time</span>
                    <span className="text-sm font-mono font-bold text-slate-700">
                      {formatTime(timer)} / {formatTime(currentTopic.timeLimit)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(timer / currentTopic.timeLimit) * 100}%` }}></div>
                  </div>
                </div>

                {/* Transcript Area */}
                {(transcript || isLoading) && (
                  <div className="mb-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-10">
                        <Loader2 className="animate-spin text-indigo-600" />
                      </div>
                    )}
                    <p className="text-slate-700 italic">&quot;{transcript || "Analyzing your speech..."}&quot;</p>
                    {audioUrl && <audio src={audioUrl} controls className="mt-4 h-8 w-full" />}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center space-x-6">
                  <button
                    onClick={() => {
                      setTimer(0);
                      setTranscript("");
                      setAudioUrl(null);
                    }}
                    className="p-4 rounded-2xl hover:bg-white border hover:border-slate-200 text-slate-400 transition-all"
                  >
                    <RotateCcw size={22} />
                  </button>

                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 ${isRecording ? "bg-white border-4 border-red-100 text-red-500" : "bg-linear-to-br from-indigo-600 to-purple-600 text-white"} ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isRecording ? <Square size={28} fill="currentColor" /> : <Mic size={32} />}
                  </button>

                  <button onClick={() => setCurrentTopicIndex((p) => (p + 1) % ACADEMIC_TOPICS.length)} className="p-4 rounded-2xl hover:bg-white border hover:border-slate-200 text-slate-400">
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Assessment) */}
          {/* Right Column - Analytics & Resources */}

          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Performance Metrics */}

            <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 flex items-center">
                  <Target size={18} className="mr-2 text-indigo-600" />
                  Assessment
                </h3>

                <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">8.0</div>
              </div>

              <div className="space-y-4 mb-6">
                {ASSESSMENT_CRITERIA.map((criterion, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-600">{criterion.label}</span>

                      <span className="text-sm font-bold text-slate-800">{criterion.score}</span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-linear-to-r ${criterion.color} rounded-full transition-all duration-1000`} style={{ width: `${(criterion.score / criterion.max) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {showFeedback && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Check size={18} className="text-emerald-600 mt-0.5" />

                    <div>
                      <p className="text-xs font-semibold text-emerald-900 mb-1">Strong Performance</p>

                      <p className="text-xs text-emerald-700">Excellent use of academic vocabulary and complex sentence structures.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Phrases */}

            <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
              <h3 className="font-semibold text-slate-900 flex items-center mb-4">
                <Brain size={18} className="mr-2 text-purple-600" />
                Academic Phrases
              </h3>

              <div className="space-y-2">
                {ADVANCED_PHRASES.map((phrase, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all group">
                    <p className="text-sm text-slate-700 group-hover:text-indigo-700 font-light italic">&quot;{phrase}&quot;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}

            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100/50">
              <h3 className="font-semibold text-slate-900 flex items-center mb-4">
                <Zap size={18} className="mr-2 text-amber-600" />
                Key Terminology
              </h3>

              <div className="flex flex-wrap gap-2">
                {currentTopic.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-900 hover:shadow-md transition-shadow cursor-pointer">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Topic Navigation */}

            <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Other Topics</h3>

              <div className="space-y-2">
                {ACADEMIC_TOPICS.map((topic, idx) => (
                  <button key={topic.id} onClick={() => setCurrentTopicIndex(idx)} className={`w-full text-left p-3 rounded-xl transition-all ${idx === currentTopicIndex ? "bg-indigo-50 border border-indigo-200" : "hover:bg-slate-50 border border-transparent"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">{topic.category}</span>

                      {idx === currentTopicIndex && <Circle size={8} className="text-indigo-600" fill="currentColor" />}
                    </div>

                    <p className="text-sm text-slate-700 line-clamp-2 font-light">{topic.question}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AcademicSpeakingPage;
