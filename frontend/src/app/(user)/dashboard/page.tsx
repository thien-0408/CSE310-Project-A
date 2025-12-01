"use client";
import { Button } from "@/components/ui/button";
import NavBarUser from "@/components/ui/navbarforuser";
import { FaPlusCircle, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import FooterUser from "@/components/ui/footeruser";
import RecentAcivity from "@/components/ui/recentact";
import ScrollTop from "@/components/ui/scroll-top";
import Link from "next/link";
import { UserProfile } from "@/types/userProfile";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { format } from "date-fns"; // Optional: You can install date-fns or use native JS date formatting

// --- Types ---

// The structure received from GET api/milestone/get-events
interface MilestoneResponse {
  id: string;
  date: string;
  eventTitle: string;
  eventDetail: string;
  userId: string;
}

// The structure sent to POST api/milestone/generate-event
interface CreateMilestoneDto {
  Date: string;
  Title: string;
  Description: string;
}

const stats = [
  {
    icon: "fa-medal",
    label: "Above average",
    subtext: "Overall Band Score",
    value: "7.5",
  },
  {
    icon: "fa-circle-check",
    label: "Keep up the great work!",
    subtext: "Practice Completion",
    value: "85%",
  },
  {
    icon: "fa-bullseye",
    label: "Based on last 5 tests",
    subtext: "Average Test Score",
    value: "7.0",
  },
];

const moduleProgressData = [
  { module: "Listening", current: 9.0 },
  { module: "Reading", current: 8.5 },
  { module: "Writing", current: 6.5 },
  { module: "Speaking", current: 6.0 },
];

const modules = [
  {
    img: "/demo/reading-picture.jpg",
    title: "Advanced Reading Strategies",
    desc: "Techniques for skimming, scanning, and understanding complex texts quickly.",
    tags: ["Reading", "Advanced"],
  },
  {
    img: "/demo/writing-picture.jpg",
    title: "Essay Structure for Task 2",
    desc: "Master the argumentative and discursive essay structures for IELTS Writing Task 2.",
    tags: ["Writing", "Intermediate"],
  },
  {
    img: "/demo/speaking-picture.jpg",
    title: "Pronunciation Practice",
    desc: "Improve your English pronunciation and intonation for higher speaking scores.",
    tags: ["Speaking", "Beginner"],
  },
  {
    img: "/demo/listening-picture.jpg",
    title: "Listening for Specific Information",
    desc: "Develop your ability to identify key details in spoken English conversations and lectures.",
    tags: ["Listening", "Intermediate"],
  },
];

export default function UserDashBoard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- Milestone State ---
  const [milestones, setMilestones] = useState<MilestoneResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<CreateMilestoneDto>({
    Title: "",
    Date: "",
    Description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

  function getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  // Get User Profile
  async function getUserProfile(token: string): Promise<UserProfile | null> {
    const endpoint: string = `${apiUrl}/api/Auth/profile`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error connecting to profile API:", error);
      return null;
    }
  }

  // Get Events (GET)
  async function fetchMilestones(token: string) {
    try {
      const response = await fetch(`${apiUrl}/api/milestone/get-events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: MilestoneResponse[] = await response.json();
        // Sort by date 
        const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setMilestones(sorted);
      } else {
        console.error("Failed to fetch milestones");
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  }

  // Create Event (POST)
  async function createMilestone() {
    if (!newEvent.Title || !newEvent.Date) {
      alert("Please fill in Title and Date");
      return;
    }

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
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      const token = getStoredToken();
      setLoading(true);

      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      // Load Profile
      const userProfile = await getUserProfile(token);
      if (userProfile) setProfile(userProfile);
      else setError(true);

      // Load Milestones
      await fetchMilestones(token);

      setLoading(false);
    }

    loadData();
  }, []);

  // Helper to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <NavBarUser />
      </div>
      <AuthGuard>
        <main className="p-4 md:p-10 lg:px-30 pt-1">
          <div className="container mx-auto">
            
            {/* Section 1: Hero */}
            <section data-aos="fade" className="p-4 tracking-tighter">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 px-15 rounded-l-2xl shadow-sm bg-gray-100">
                  <div className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-4">
                      Good Morning,{" "}
                      <span className="bg-gradient-to-b from-[#00B4DB] to-[#0083B0] bg-clip-text text-transparent">
                        {profile?.fullName}
                      </span>
                    </h1>
                    <p>Ready to master your IELTS with confidence?</p>
                  </div>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg">
                    <Link href={"/tests"}>Continue Practicing</Link>
                  </Button>
                </div>
                <div className="relative overflow-hidden w-full h-64 md:h-full shadow-sm rounded-r-2xl bg-white">
                  <Image src="/demo/user-home-dashboard.png" alt="Study Picture" fill className="object-contain" sizes="20" />
                </div>
              </div>
            </section>

            {/* Section 2: Stats */}
            <section data-aos="fade" className="p-4">
              <h1 className="text-2xl font-extrabold tracking-tighter">
                Your <span className="text-blue-500">Performance</span> Snapshot
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-15 py-5">
                {stats.map((card, index) => (
                  <div key={index} className="p-5 py-8 hover:scale-105 transition-all duration-300 rounded-xl shadow-sm border border-gray-100 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                      <div className="text-center pb-2">
                        <i className={`fa-solid ${card.icon} text-[#4b91e2] text-5xl`}></i>
                        <p className="text-center pt-4 text-sm font-medium text-gray-600">{card.label}</p>
                      </div>
                      <div>
                        <p className="text-center pb-3 text-xs text-gray-400">{card.subtext}</p>
                        <h1 className="text-4xl font-extrabold text-center text-gray-800">{card.value}</h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Charts */}
            <section data-aos="fade" className="tracking-tighter bg-white mb-10 mx-4">
              <div className="p-8 rounded-xl border-2 border-gray-100 shadow-md">
                <h1 className="text-3xl font-extrabold pb-4">
                  Skill <span className="text-blue-500">Performance</span>
                </h1>
                <p className="text-gray-900 font-medium">Your current performance across key IELTS skills.</p>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 pt-8 px-0 md:px-10">
                  <Card className="border-0 shadow-none">
                    <CardContent className="pl-0">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={moduleProgressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="module" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                          <YAxis domain={[0, 9]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                          <Tooltip cursor={{fill: '#f3f4f6'}} />
                          <Bar dataKey="current" fill="#3b82f6" name="Score" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 4: Upcoming Milestones (CAROUSEL) */}
            <section data-aos="fade" className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-extrabold tracking-tighter">
                  Upcoming <span className="text-blue-600">Milestones</span>
                </h1>
                {/* Optional: Add navigation arrows here if desired */}
              </div>

              {/* Carousel Container */}
              <div className="w-full relative">
                <div className="flex overflow-x-auto pb-6 gap-6 snap-x no-scrollbar items-stretch">
                  
                  {/* Map Events from API */}
                  {milestones.length > 0 ? (
                    milestones.map((item) => (
                      <div
                        key={item.id}
                        className="min-w-[280px] w-[280px] md:min-w-[320px] snap-center flex flex-col justify-between p-6 border border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 bg-white"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">
                              Event
                            </div>
                            <FaCalendarAlt className="text-gray-300" />
                          </div>
                          
                          <h1 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
                            {item.eventTitle}
                          </h1>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <i className="fa-regular fa-clock mr-2"></i>
                            {formatDate(item.date)}
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-md">
                            {item.eventDetail}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          className="mt-4 w-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 justify-start px-0"
                        >
                          View Details &rarr;
                        </Button>
                      </div>
                    ))
                  ) : (
                    // Empty state if no events
                    <div className="min-w-[280px] flex items-center justify-center text-gray-400 text-sm italic">
                      No upcoming events found.
                    </div>
                  )}

                  {/* Add New Event Button (Placed at the End) */}
                  <div 
                    onClick={() => setIsModalOpen(true)}
                    className="min-w-[100px] md:min-w-[150px] snap-center cursor-pointer flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                  >
                     <FaPlusCircle className="text-4xl text-gray-300 group-hover:text-blue-500 transition-colors mb-2" />
                     <span className="text-gray-500 font-medium group-hover:text-blue-600 text-sm">Add Event</span>
                  </div>

                </div>
              </div>
            </section>

            {/* Section 5: Recommended Practice */}
            <section data-aos="fade" className="p-4 tracking-tighter">
              <h1 className="text-2xl font-extrabold ">
                Recommended <span className="text-blue-600">Practice</span>
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5 mx-1 lg:mx-40">
                {modules.map(({ img, title, desc, tags }, i) => (
                  <div key={i} className="rounded-2xl shadow-sm overflow-hidden bg-white border border-gray-100">
                    <div className="relative w-full h-48">
                      <Image src={img} fill alt={title} className="object-cover" sizes="20"/>
                    </div>
                    <div className="px-8 py-6">
                      <h1 className="text-lg font-bold text-gray-800 mb-2">{title}</h1>
                      <p className="pb-4 font-normal text-gray-600 text-sm">{desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, j) => (
                          <span key={j} className={`py-1 px-3 rounded-full text-xs font-medium ${j === 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 mt-6 w-full rounded-md">
                        Start Module
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Recent Activity */}
            <section data-aos="fade" className="p-4 tracking-tighter">
              <h1 className="text-2xl font-extrabold mb-10">
                Recent <span className="text-blue-500">Activity</span>
              </h1>
              <RecentAcivity />
            </section>
          </div>
        </main>
      </AuthGuard>

      {/* --- ADD EVENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Add New Milestone</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                <input 
                  type="text" 
                  value={newEvent.Title}
                  onChange={(e) => setNewEvent({...newEvent, Title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="e.g. Speaking Mock Test"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  value={newEvent.Date}
                  onChange={(e) => setNewEvent({...newEvent, Date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Details / Location</label>
                <textarea 
                  rows={3}
                  value={newEvent.Description}
                  onChange={(e) => setNewEvent({...newEvent, Description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                  placeholder="Enter specific details..."
                />
              </div>
            </div>

            <div className="p-6 pt-2 flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={createMilestone}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <FooterUser />
      <ScrollTop />
    </>
  );
}