"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  History, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight 
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import NavBarUser from "@/components/ui/navbarforuser";
import FooterUser from "@/components/ui/footeruser";
import ScrollTop from "@/components/ui/scroll-top";
import AuthGuard from "@/components/auth/AuthGuard";
import Loader from "@/components/ui/Loader";

// --- Interfaces ---
interface TestHistoryItem {
  testId: string;
  accuracy: number;
  isCompleted: boolean;
  skill: string;
  takenDate: string;
  finishDate: string;
  title: string;
}

// --- Mock Data for Charts (Accuracy %) ---
const accuracyData = [
  { name: "Listening", accuracy: 65, fill: "#3b82f6" }, // Blue
  { name: "Reading", accuracy: 78, fill: "#10b981" },   // Green
  { name: "Writing", accuracy: 55, fill: "#f59e0b" },   // Amber
];

export default function PracticePage() {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

  // --- API Fetching ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch(`${apiUrl}/api/user/test-history`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [apiUrl]);

  // --- Helpers ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSkillIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case "reading": return <BookOpen className="w-4 h-4" />;
      case "listening": return <Headphones className="w-4 h-4" />;
      case "writing": return <PenTool className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const getSkillColor = (skill: string) => {
     switch (skill.toLowerCase()) {
      case "reading": return "text-green-600 bg-green-50 border-green-200";
      case "listening": return "text-blue-600 bg-blue-50 border-blue-200";
      case "writing": return "text-amber-600 bg-amber-50 border-amber-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <NavBarUser />
      </div>

      <AuthGuard>
        <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8 space-y-10">
          
          {/* 1. Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Practice <span className="text-blue-600">Modules</span>
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Select a skill to improve or review your recent performance.
              </p>
            </div>
          </div>

          {/* 2. Practice Modules Grid (Removed Speaking) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Listening */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-200">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Headphones className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Listening Practice</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">
                  Train your ear with various accents and speeds.
                </p>
                <div className="w-full space-y-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Progress</span>
                    <span>70%</span>
                  </div>
                  <Progress value={70} className="h-2 bg-blue-100" /> {/* Blue indicator */}
                  <Button className="w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                    Start Listening
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reading */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-green-200">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reading Comprehension</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">
                  Master skimming, scanning, and detail analysis.
                </p>
                <div className="w-full space-y-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Progress</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-green-100" /> {/* Green indicator */}
                  <Button className="w-full bg-white text-green-600 border border-green-200 hover:bg-green-50 hover:border-green-300">
                    <Link href="/tests">Start Reading</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Writing */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-amber-200">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PenTool className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Writing</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">
                  Refine your essay structure and vocabulary.
                </p>
                <div className="w-full space-y-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Progress</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} className="h-2 bg-amber-100" /> {/* Amber indicator */}
                  <Button className="w-full bg-white text-amber-600 border border-amber-200 hover:bg-amber-50 hover:border-amber-300">
                    Start Writing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 3. Analytics & History Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Analytics Chart (Accuracy 0-100) */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="border-none shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Accuracy Overview
                  </CardTitle>
                  <CardDescription>Average accuracy per skill module.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          domain={[0, 100]} 
                          tickFormatter={(val) => `${val}%`}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                          dataKey="accuracy" 
                          name="Accuracy" 
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Tests Taken</p>
                        <p className="text-2xl font-bold text-gray-900">{history.length}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Avg. Accuracy</p>
                        <p className="text-2xl font-bold text-blue-600">
                             {history.length > 0 
                                ? Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length) 
                                : 0
                             }%
                        </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Test History List */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-sm min-h-[500px]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <History className="w-5 h-5 text-gray-600" />
                        Recent Test History
                    </CardTitle>
                    <CardDescription>Your latest practice attempts.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    {history.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No history found. Start a test to see results!</p>
                        </div>
                    ) : (
                        history.map((test) => (
                        <div 
                            key={test.testId + test.takenDate} // Composite key just in case
                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-blue-100 transition-all duration-200"
                        >
                            {/* Left: Icon & Title */}
                            <div className="flex items-start gap-4 mb-3 sm:mb-0">
                                <div className={`p-3 rounded-lg border ${getSkillColor(test.skill)}`}>
                                    {getSkillIcon(test.skill)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                        {test.title || "Untitled Test"}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-500">
                                            {test.skill}
                                        </Badge>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {formatDate(test.takenDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Accuracy & Status */}
                            <div className="flex items-center gap-6 pl-14 sm:pl-0">
                                <div className="text-right">
                                    <span className="block text-xs text-gray-400 uppercase font-semibold">Accuracy</span>
                                    <span className={`text-lg font-bold ${
                                        test.accuracy >= 80 ? 'text-green-600' :
                                        test.accuracy >= 50 ? 'text-blue-600' : 'text-red-500'
                                    }`}>
                                        {test.accuracy}%
                                    </span>
                                </div>
                                <div>
                                    {test.isCompleted ? (
                                        <div className="flex flex-col items-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="text-[10px] text-green-600 font-medium">Done</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300" />
                                            <span className="text-[10px] text-gray-400 font-medium">Draft</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </AuthGuard>
      <FooterUser />
      <ScrollTop />
    </div>
  );
}