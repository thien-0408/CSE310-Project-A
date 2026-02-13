"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, ChevronRight, RotateCcw, Target, Zap, Check, Circle, Loader2, Send } from "lucide-react";
import NavBar from "@/components/ui/navbar";

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
      return <div key={i} className={`w-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full transition-all duration-150 ${isActive ? "opacity-100" : "opacity-30"}`} style={{ height: `${height}px` }} />;
    })}
  </div>
);

const AcademicSpeakingPage = () => {
  // --- States ---
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading khi đang gọi API
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  
  // State mới để lưu file và url
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // --- Refs ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentTopic = ACADEMIC_TOPICS[currentTopicIndex];

  // --- Timer Logic (Đã tách logic upload ra khỏi đây) ---
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

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

      mediaRecorder.onstop = () => {
        // Tạo blob khi dừng ghi âm
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        
        // Lưu vào state để chờ người dùng bấm Submit
        setAudioUrl(url);
        setRecordedBlob(audioBlob);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Reset trạng thái cũ
      setShowFeedback(false);
      setTranscript("");
      setRecordedBlob(null);
      setAudioUrl(null);
      setTimer(0);
      
    } catch (err) {
      alert("Vui lòng cấp quyền truy cập Micro!");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      // isRecording sẽ được set false trong sự kiện onstop
    }
  };

  const handleReset = () => {
    setTimer(0);
    setTranscript("");
    setAudioUrl(null);
    setRecordedBlob(null);
    setShowFeedback(false);
    setIsRecording(false);
  };

  // --- API / Submit Logic ---
  const handleSubmit = async () => {
    if (!recordedBlob) {
      alert("Không tìm thấy file ghi âm!");
      return;
    }

    setIsLoading(true);
    setTranscript("Đang phân tích audio...");

    const formData = new FormData();
    formData.append("audio", recordedBlob, "speech.wav");
    formData.append("question", currentTopic.question);

    try {
      const response = await fetch("http://localhost:5151/api/speaking/test-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload success:", data);
      
      setTranscript("Phân tích hoàn tất! (Dữ liệu trả về từ API sẽ hiển thị ở đây)");
      setShowFeedback(true);

    } catch (error) {
      console.error(error);
      setTranscript("Lỗi khi gửi audio lên server.");
      alert("Lỗi kết nối đến server");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-neutral-50">
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

              <div className="p-8 bg-gradient-to-b from-white to-slate-50/30">
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

                {/* Transcript / Audio Player Area */}
                {(audioUrl || isLoading || transcript) && (
                  <div className="mb-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-10">
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                            <span className="text-sm text-indigo-600 font-medium">Sending to AI...</span>
                        </div>
                      </div>
                    )}
                    
                    {audioUrl && !isRecording && (
                        <div className="mb-4">
                            <p className="text-xs text-slate-400 font-bold mb-2 uppercase">Your Recording</p>
                            <audio src={audioUrl} controls className="w-full h-10" />
                        </div>
                    )}

                    {transcript && <p className="text-slate-700 italic border-t pt-2 mt-2">&quot;{transcript}&quot;</p>}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center space-x-6">
                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    disabled={isRecording || isLoading}
                    className="p-4 rounded-2xl hover:bg-white border hover:border-slate-200 text-slate-400 transition-all disabled:opacity-50"
                  >
                    <RotateCcw size={22} />
                  </button>

                  {/* Record / Stop Button */}
                  {!audioUrl ? (
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isLoading}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 ${
                          isRecording 
                            ? "bg-white border-4 border-red-100 text-red-500" 
                            : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isRecording ? <Square size={28} fill="currentColor" /> : <Mic size={32} />}
                      </button>
                  ) : (
                      /* Submit Button - Only shows when audioUrl exists */
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all transform hover:scale-105"
                      >
                         <Send size={28} className={isLoading ? "opacity-0" : "ml-1"} />
                      </button>
                  )}

                  {/* Next Topic Button */}
                  <button onClick={() => {
                      setCurrentTopicIndex((p) => (p + 1) % ACADEMIC_TOPICS.length);
                      handleReset();
                    }} 
                    disabled={isRecording}
                    className="p-4 rounded-2xl hover:bg-white border hover:border-slate-200 text-slate-400 disabled:opacity-50"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
                
                {/* Helper Text */}
                <div className="text-center mt-4 h-6">
                    {isRecording && <p className="text-xs text-red-500 animate-pulse font-medium">Recording...</p>}
                    {!isRecording && audioUrl && !isLoading && <p className="text-xs text-emerald-600 font-medium">Recording saved. Press Send to submit.</p>}
                </div>

              </div>
            </div>
          </div>

          {/* Right Column (Assessment) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* ... (Giữ nguyên phần UI bên phải của bạn) ... */}
            
            {/* Assessment Metrics (Sample placeholder) */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-900 flex items-center">
                    <Target size={18} className="mr-2 text-indigo-600" /> Assessment
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">8.0</div>
                </div>
                {/* ... existing criteria rendering ... */}
                <div className="space-y-4 mb-6">
                 {ASSESSMENT_CRITERIA.map((criterion, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-600">{criterion.label}</span>
                            <span className="text-sm font-bold text-slate-800">{criterion.score}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${criterion.color}`} style={{ width: `${(criterion.score / criterion.max) * 100}%` }}></div>
                        </div>
                    </div>
                 ))}
                </div>
                 {showFeedback && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <Check size={18} className="text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-900 mb-1">Feedback Received</p>
                          <p className="text-xs text-emerald-700">API processed successfully.</p>
                        </div>
                      </div>
                    </div>
                  )}
            </div>

            {/* Keywords */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100/50">
               <h3 className="font-semibold text-slate-900 flex items-center mb-4">
                 <Zap size={18} className="mr-2 text-amber-600" /> Key Terminology
               </h3>
               <div className="flex flex-wrap gap-2">
                 {currentTopic.keywords.map((keyword, idx) => (
                   <span key={idx} className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-900">
                     {keyword}
                   </span>
                 ))}
               </div>
            </div>
            {/* End Right Column Content */}

          </div>
        </div>
      </main>
    </div>
  );
};

export default AcademicSpeakingPage;