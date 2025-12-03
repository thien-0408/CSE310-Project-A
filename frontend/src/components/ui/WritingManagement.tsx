"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  ArrowLeft, 
  User, 
  FileText, 
  Save, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "./ToastNotification";
import Image from "next/image";

// --- Types ---
interface SubmissionSummary {
  submissionId: string;
  testTitle: string;
  userName: string;
  submittedDate: string;
  status: "Pending" | "Graded";
  imageUrl?: string | null;
}

interface SubmissionDetail {
  id: string; 
  testTitle: string;
  topic: string;
  testImage?: string;
  studentName: string;
  content: string; 
  wordCount: number;
  imageUrl: string;
}

// --- Component Chính ---
export default function AdminWritingGrading() {
  const [view, setView] = useState<"LIST" | "GRADING">("LIST");
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const API_URL = "http://localhost:5151"; 

  // --- State cho Form chấm điểm ---
  const [gradingData, setGradingData] = useState({
    TaskResponse: 0,
    CoherenceCohesion: 0,
    LexicalResource: 0,
    GrammaticalRange: 0,
    OverallScore: 0,
    GeneralFeedback: "",
    GrammarFeedback: "",
    VocabularyFeedback: "",
  });

  // --- 1. Fetch Danh sách bài Pending ---
  const fetchPendingSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/writing-test/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setSubmissions(data);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load submissions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  // --- 2. Lấy chi tiết bài làm để chấm ---
  const handleStartGrading = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/writing-test/user-submission/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSelectedSubmission(data);
        setView("GRADING");
        // Reset form
        setGradingData({
          TaskResponse: 0,
          CoherenceCohesion: 0,
          LexicalResource: 0,
          GrammaticalRange: 0,
          OverallScore: 0,
          GeneralFeedback: "",
          GrammarFeedback: "",
          VocabularyFeedback: "",
        });
      } else {
        showToast("Could not load submission details", "error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const { TaskResponse, CoherenceCohesion, LexicalResource, GrammaticalRange } = gradingData;
    if (TaskResponse > 0 && CoherenceCohesion > 0) {
      const avg = (Number(TaskResponse) + Number(CoherenceCohesion) + Number(LexicalResource) + Number(GrammaticalRange)) / 4;
      const rounded = Math.round(avg * 2) / 2;
      setGradingData(prev => ({ ...prev, OverallScore: rounded }));
    }
  }, [gradingData.TaskResponse, gradingData.CoherenceCohesion, gradingData.LexicalResource, gradingData.GrammaticalRange]);

  // --- 4. Submit Grading ---
  const handleSubmitGrading = async () => {
    if (!selectedSubmission) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        SubmissionId: selectedSubmission.id,
        ...gradingData,
        GrammerFeedback: gradingData.GrammarFeedback 
      };

      const res = await fetch(`${API_URL}/api/writing-test/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast("Grading saved successfully!", "success");
        setView("LIST");
        fetchPendingSubmissions(); // Refresh list
      } else {
        showToast("Failed to save grading", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Network error", "error");
    }
  };

  // --- RENDER: VIEW LIST ---
  if (view === "LIST") {
    return (
      <div className=" space-y-6  mx-auto">
        <ToastComponent />
        <div className="flex justify-between items-center">
          <div className="mt-10">
            <h1 className="text-2xl font-bold text-gray-900">Writing Submissions</h1>
            <p className="text-gray-500 text-sm">Manage and grade student essays.</p>
          </div>
          <Button onClick={fetchPendingSubmissions} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Test Title</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No pending submissions found.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((item) => (
                  <TableRow key={item.submissionId} className="">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                          <Image src={API_URL+item.imageUrl || ""} alt="" width={200} height={200} className="rounded-full h-12 w-12"></Image>
                        {item.userName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{item.testTitle}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(item.submittedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button className="bg-blue-500 text-white hover:bg-blue-700"  size="sm" onClick={() => handleStartGrading(item.submissionId)}>
                        Grade Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  // --- RENDER: VIEW GRADING (SPLIT SCREEN) ---
  if (!selectedSubmission) return <Loader2 className="animate-spin" />;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <ToastComponent />
      
      {/* Header */}
      <header className="bg-transparent border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setView("LIST")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-bold text-gray-800 text-lg line-clamp-1">{selectedSubmission.testTitle}</h2>
            <p className="text-xs text-gray-500">Student: <b>{selectedSubmission.studentName}</b></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
             <span className="block text-xs text-gray-400 uppercase font-bold">Word Count</span>
             <span className="font-mono font-bold text-blue-600">{selectedSubmission.wordCount}</span>
          </div>
          <Button onClick={handleSubmitGrading} className="bg-blue-500 hover:bg-blue-700 text-white p-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 text-base font-semibold group">
             Save
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: User's Essay */}
        <div className="w-full lg:w-1/2 overflow-y-auto p-6 lg:p-8 bg-white border-r border-gray-200">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Topic Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Topic
              </h3>
              <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                {selectedSubmission.topic}
              </p>
              {selectedSubmission.testImage && (
                
                <Image src={"http://localhost:5151/"+selectedSubmission.testImage} width={600} height={200} alt="Task" className="mt-4 rounded-lg border  object-contain" />
              )}
            </div>

            {/* Student Content */}
            <div className="prose prose-slate max-w-none">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Student Response
              </h3>
              <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm font-serif text-lg leading-loose text-gray-800 whitespace-pre-wrap" style={{ fontFamily: '"Merriweather", "Georgia", serif', }} >
                {selectedSubmission.content}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Grading Form */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Score Inputs */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-800 flex justify-between items-center">
                  <Badge className="text-lg px-3 py-1 bg-blue-600 hover:bg-blue-700">
                    Average: {gradingData.OverallScore}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-2 gap-4">
                {["TaskResponse", "CoherenceCohesion", "LexicalResource", "GrammaticalRange"].map((criteria) => (
                  <div key={criteria} className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      {criteria.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Input 
                      type="text" 
                      min="0" max="100" step="5"
                      value={gradingData[criteria as keyof typeof gradingData] as number}
                      onChange={(e) => setGradingData({...gradingData, [criteria]: parseFloat(e.target.value) || 0})}
                      className="font-bold text-center"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feedback Inputs */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-800">Detailed Feedback</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">General Feedback</label>
                  <Textarea 
                    placeholder="Overall comments on performance..." 
                    rows={3}
                    value={gradingData.GeneralFeedback}
                    onChange={(e) => setGradingData({...gradingData, GeneralFeedback: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Vocabulary Improvements</label>
                  <Textarea 
                    placeholder="Suggest better word choices..." 
                    rows={3}
                    value={gradingData.VocabularyFeedback}
                    onChange={(e) => setGradingData({...gradingData, VocabularyFeedback: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Grammar Corrections</label>
                  <Textarea 
                    placeholder="Point out grammatical errors..." 
                    rows={3}
                    value={gradingData.GrammarFeedback}
                    onChange={(e) => setGradingData({...gradingData, GrammarFeedback: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </main>
    </div>
  );
}