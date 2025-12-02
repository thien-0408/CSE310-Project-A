"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBarUser from "@/components/ui/navbarforuser";
import FooterUser from "@/components/ui/footeruser";
import ScrollTop from "@/components/ui/scroll-top";
import RecentAcivity from "@/components/ui/recentact";
import { TestHistoryItem } from "@/types/dataRetrieve";
import { MilestoneResponse } from "@/types/dataRetrieve";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  Plus,
  Calendar,
  Clock,
  ChevronRight,
  Target,
  Activity,
  CheckCircle2,
  X,
} from "lucide-react";

// Charts
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { UserProfile } from "@/types/userProfile";

// --- Types --
interface CreateMilestoneDto {
  Date: string;
  Title: string;
  Description: string;
}
const modules = [
  {
    img: "/demo/reading-picture.jpg",
    title: "Advanced Reading Strategies",
    desc: "Techniques for skimming, scanning, and understanding complex texts.",
    tags: ["Reading", "Advanced"],
    color: "bg-purple-100 text-purple-700",
  },
  {
    img: "/demo/writing-picture.jpg",
    title: "Essay Structure for Task 2",
    desc: "Master the argumentative and discursive essay structures.",
    tags: ["Writing", "Intermediate"],
    color: "bg-blue-100 text-blue-700",
  },
  {
    img: "/demo/speaking-picture.jpg",
    title: "Pronunciation Practice",
    desc: "Improve intonation for higher speaking coherence.",
    tags: ["Speaking", "Beginner"],
    color: "bg-orange-100 text-orange-700",
  },
  {
    img: "/demo/listening-picture.jpg",
    title: "Listening for Details",
    desc: "Identify key details in spoken English conversations.",
    tags: ["Listening", "Intermediate"],
    color: "bg-green-100 text-green-700",
  },
];

export default function UserDashBoard() {
  // State
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // Milestones State
  const [milestones, setMilestones] = useState<MilestoneResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<CreateMilestoneDto>({
    Title: "",
    Date: "",
    Description: "",
  });
  // Stats Data
  const stats = useMemo(() => {
    // 1. Nếu chưa có dữ liệu, trả về default (0)
    if (!history || history.length === 0) {
      return [
        {
          icon: Activity,
          label: "Overall Accuracy",
          subtext: "No data yet",
          value: "0%",
          trend: "0%",
          color: "text-gray-400",
          bgColor: "bg-gray-50",
        },
        {
          icon: CheckCircle2,
          label: "Completion Rate",
          subtext: "Practice exercises",
          value: "0%",
          trend: "0%",
          color: "text-gray-400",
          bgColor: "bg-gray-50",
        },
        {
          icon: Target,
          label: "Average Score",
          subtext: "Last 5 mock tests",
          value: "0%",
          trend: "0%",
          color: "text-gray-400",
          bgColor: "bg-gray-50",
        },
      ];
    }

    // Sort history by date
    const sortedHistory = [...history].sort(
      (a, b) => new Date(b.takenDate).getTime() - new Date(a.takenDate).getTime()
    );

    // --- Overall ---
    const totalAccuracy = sortedHistory.reduce((acc, item) => acc + item.accuracy, 0);
    const overallAccuracy = Math.round(totalAccuracy / sortedHistory.length);

    // Trend: compare 5 recent tests to overall accuracy
    const recent5 = sortedHistory.slice(0, 5);
    const recent5Avg = recent5.length > 0 
      ? recent5.reduce((acc, item) => acc + item.accuracy, 0) / recent5.length 
      : 0;
    const accuracyTrend = Math.round(recent5Avg - overallAccuracy);
    const accuracyTrendStr = accuracyTrend > 0 ? `+${accuracyTrend}%` : `${accuracyTrend}%`;

    // --- Completion Rate ---
    const completedCount = sortedHistory.filter((item) => item.isCompleted).length;
    const completionRate = Math.round((completedCount / sortedHistory.length) * 100);
    
    // Trend 
    const recent5Completed = recent5.filter(i => i.isCompleted).length;
    const recentCompletionRate = recent5.length > 0 
      ? Math.round((recent5Completed / recent5.length) * 100) 
      : 0;
    const completionTrend = recentCompletionRate - completionRate;
    const completionTrendStr = completionTrend > 0 ? `+${completionTrend}%` : `${completionTrend}%`;

    // --- Metric 3: Average Score (Last 5) ---
    const prev5 = sortedHistory.slice(5, 10);
    const prev5Avg = prev5.length > 0 
      ? prev5.reduce((acc, item) => acc + item.accuracy, 0) / prev5.length 
      : 0; 
    
    const scoreTrendVal = Math.round(recent5Avg - prev5Avg);
    const scoreTrendStr = scoreTrendVal > 0 ? `+${scoreTrendVal}%` : `${scoreTrendVal}%`;

    // --- Construct Stats Array ---
    return [
      {
        icon: Activity,
        label: "Overall Accuracy",
        subtext: "vs. Recent Performance",
        value: `${overallAccuracy}%`,
        trend: accuracyTrendStr,
        color: accuracyTrend >= 0 ? "text-blue-600" : "text-red-500",
        bgColor: accuracyTrend >= 0 ? "bg-blue-50" : "bg-red-50",
      },
      {
        icon: CheckCircle2,
        label: "Completion Rate",
        subtext: "Total exercises",
        value: `${completionRate}%`,
        trend: completionTrendStr,
        color: completionTrend >= 0 ? "text-green-600" : "text-amber-600",
        bgColor: completionTrend >= 0 ? "bg-green-50" : "bg-amber-50",
      },
      {
        icon: Target,
        label: "Recent Average",
        subtext: "Last 5 mock tests",
        value: `${Math.round(recent5Avg)}%`,
        trend: scoreTrendStr,
        color: scoreTrendVal >= 0 ? "text-orange-600" : "text-red-500",
        bgColor: scoreTrendVal >= 0 ? "bg-orange-50" : "bg-red-50",
      },
    ];
  }, [history]);
  const avgReadingAccuracy = history.length > 0 
                                ? Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length) 
                                : 0;
  const moduleProgressData = [
    { module: "Listening", accuracy: 85 }, // ~Band 8.0-8.5
    { module: "Reading", accuracy: avgReadingAccuracy }, // ~Band 7.5
    { module: "Writing", accuracy: 65 }, // ~Band 6.0-6.5
    { module: "Speaking", accuracy: 70 }, // ~Band 6.5-7.0
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl: string =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

  // --- Helpers ---
  function getStoredToken(): string | null {
    if (typeof window !== "undefined")
      return localStorage.getItem("accessToken");
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // --- API Functions ---
  async function getUserProfile(token: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${apiUrl}/api/Auth/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Profile API error:", error);
      return null;
    }
  }

  async function fetchMilestones(token: string) {
    try {
      const response = await fetch(`${apiUrl}/api/milestone/get-events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data: MilestoneResponse[] = await response.json();
        const sorted = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setMilestones(sorted);
      }
    } catch (error) {
      console.error("Milestones API error:", error);
    }
  }

  async function createMilestone() {
    if (!newEvent.Title || !newEvent.Date)
      return alert("Please fill in Title and Date");
    const token = getStoredToken();
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/api/milestone/generate-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        await fetchMilestones(token);
        setIsModalOpen(false);
        setNewEvent({ Title: "", Date: "", Description: "" });
      } else {
        alert("Failed to create event.");
      }
    } catch (error) {
      console.error("Create event error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Fetch Test History
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
          console.log("Fetched history:", data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [apiUrl]);

  // --- Effect ---
  useEffect(() => {
    async function loadData() {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const userProfile = await getUserProfile(token);
      if (userProfile) setProfile(userProfile);
      await fetchMilestones(token);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <NavBarUser />
      </div>

      <AuthGuard>
        <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8 space-y-10">
          {/* 1. Hero Section - Clean & Welcoming */}
          <section
            data-aos="fade-right"
            data-aos-duration="500"
            className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 p-8 lg:p-12"
          >
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div>
                  <h2 className="text-gray-500 font-medium mb-2 uppercase tracking-wider text-sm">
                    Welcome back
                  </h2>
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Hello,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      {profile?.fullName || "Student"}
                    </span>
                  </h1>
                </div>
                <p className="text-lg text-gray-600 max-w-md">
                  Ready to boost your accuracy today? Let&apos;s verify your
                  progress and keep the momentum going.
                </p>
                <div className="flex gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 px-8"
                  >
                    <Link href="/tests">Start Practicing</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    <Link href="/analytics">View Reports</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] w-full hidden lg:block">
                {/* Replace with a better illustration if available */}
                <Image
                  src="/demo/user-home-dashboard.png"
                  alt="Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </section>

          {/* 2. Key Metrics (Accuracy Focused) */}
          <section data-aos="fade-left" data-aos-duration="500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="border-none shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <CardContent className="p-6 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          {stat.label}
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </h3>
                        <div className="flex items-center mt-2 gap-2">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              stat.trend.startsWith("+")
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {stat.trend}
                          </span>
                          <span className="text-xs text-gray-400">
                            {stat.subtext}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 3. Analytics Chart (Accuracy 0-100) */}
          <section
            data-aos="fade-up"
            data-aos-duration="500"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <Card className="border-none shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Skill Accuracy Analysis</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 font-normal"
                    >
                      Last 30 Days <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={moduleProgressData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        barSize={50}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="module"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 13 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          domain={[0, 100]} // Scale 0-100
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="accuracy"
                          name="Accuracy (%)"
                          fill="#3b82f6"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 4. Recent Activity (Sidebar style) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Recent Activity
                  </h3>
                  <Link
                    href="#"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View All
                  </Link>
                </div>
                {/* Reuse your existing component, but ensure it fits the container */}
                <RecentAcivity />
              </div>
            </div>
          </section>

          {/* 5. Milestones (Horizontal Scroll) */}
          <section data-aos="fade-right" data-aos-duration="500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Upcoming Milestones
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Track your exams and preparation goals.
                </p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="bg-gray-900 text-white hover:bg-black gap-2"
              >
                <Plus className="w-4 h-4" /> Add Event
              </Button>
            </div>

            <div className="w-full relative group">
              <div className="flex overflow-x-auto pb-8 gap-5 snap-x no-scrollbar">
                {milestones.length > 0 ? (
                  milestones.map((item) => (
                    <div
                      key={item.id}
                      className="min-w-[300px] w-[300px] snap-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Event
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {item.eventTitle}
                      </h3>

                      <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.date)}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                        {item.eventDetail}
                      </p>

                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-1/3 rounded-full"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No upcoming events.
                    </p>
                    <p className="text-gray-400 text-sm">
                      Add a milestone to stay on track.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 6. Recommended Practice */}
          <section
            data-aos="fade-left"
            data-aos-duration="500"
            className="pb-10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recommended Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.map((mod, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={mod.img}
                      fill
                      alt={mod.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-white/90 text-gray-800`}
                      >
                        {mod.tags[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3
                      className="font-bold text-gray-900 mb-2 line-clamp-1"
                      title={mod.title}
                    >
                      {mod.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
                      {mod.desc}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors"
                    >
                      Start Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </AuthGuard>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Create Milestone
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Event Title
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={newEvent.Title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, Title: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="e.g. Official IELTS Exam"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={newEvent.Date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, Date: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newEvent.Description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, Description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                  placeholder="Add details about location, preparation needed, etc."
                />
              </div>
            </div>

            <div className="p-6 pt-2 flex gap-3 bg-gray-50/50">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={createMilestone}
                disabled={isSubmitting}
                className="flex-1 bg-gray-900 hover:bg-black text-white"
              >
                {isSubmitting ? "Saving..." : "Save Event"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <FooterUser />
      <ScrollTop />
    </div>
  );
}
