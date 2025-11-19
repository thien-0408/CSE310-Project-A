"use client";
import { Button } from "@/components/ui/button";
import NavBarUser from "@/components/ui/navbarforuser";
import { FaPlusCircle } from "react-icons/fa";
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
import { useState } from "react";
import { useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

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

const milestones = [
  { date: "July 15, 2024", location: "British Council" },
  { date: "August 17, 2024", location: "IDP" },
  { date: "October 20, 2024", location: "British Council" },
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

  //API get profile
  const apiUrl: string =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";
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

      if (!response.ok) {
        const errorBody = await response
          .json()
          .catch(() => ({ message: "Unexpected error" }));
        console.error(
          `Error ${response.status} when getting profile:`,
          errorBody
        );
        return null;
      }
      const data: UserProfile = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error when trying to connect:", error);
      return null;
    }
  }
  function getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }
  useEffect(() => {
    // Call API in useeffect
    async function loadUserProfileData() {
      const token = getStoredToken();
      setLoading(true);

      if (!token) {
        console.warn("Can't find token");
        setError(true);
        setLoading(false);
        return;
      }

      console.log("Loading profile with token...");

      const userProfile = await getUserProfile(token);

      if (userProfile) {
        console.log("Profile loaded");
        setProfile(userProfile);
      } else {
        console.error("Fail to load profile");
        setError(true);
      }
      setLoading(false);
    }

    loadUserProfileData();
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50">
        <NavBarUser></NavBarUser>
      </div>
      <AuthGuard>
        <main
          className="p-10 lg:px-30 pt-1"
          
        >
          <div className="container mx-auto">
            {/* Section 1: Hero */}
            <section data-aos="fade" className="p-4 tracking-tighter">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left */}
                <div className="p-8 px-15  rounded-l-2xl shadow-sm bg-gray-100">
                  <div className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-4">
                      Good Morning,{" "}
                      <span className="bg-gradient-to-b from-[#00B4DB] to-[#0083B0] bg-clip-text text-transparent">
                        {profile?.fullName}
                      </span>
                    </h1>
                    <p>Ready to master your IELTS with confidence?</p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={"/tests"}>Continue Practicing</Link>
                  </Button>
                </div>
                {/* Right */}
                <div className="relative overflow-hidden w-full h-full shadow-sm rounded-r-2xl ">
                  <Image
                    src="/demo/user-home-dashboard.png"
                    alt="Study Picture"
                    fill
                    className="object-contain bg-gray-10"
                  />{" "}
                </div>
              </div>
            </section>
            {/* Section 2: Stats */}

            <section data-aos="fade" className="p-4">
              <h1 className="text-2xl font-extrabold tracking-tighter">
                Your <span className="text-blue-500">Performance</span> Snapshot
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-15 py-5">
                {stats.map((card, index) => (
                  <div
                    key={index}
                    className="p-5  py-8 hover:scale-110 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                      <div className="text-center pb-2">
                        <i
                          className={`fa-solid ${card.icon} text-[#4b91e2] text-5xl`}
                        ></i>
                        <p className="text-center pt-4">{card.label}</p>
                      </div>
                      <div>
                        <p className="text-center pb-3">{card.subtext}</p>
                        <h1 className="text-4xl font-extrabold text-center">
                          {card.value}
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section
              data-aos="fade"
              className=" tracking-tighter bg-white mb-10"
            >
              <div className="p-8 rounded-xl border-2 border-gray-100 shadow-md">
                <h1 className="text-3xl font-extrabold pb-4">
                  Skill <span className="text-blue-500">Performance</span>
                </h1>
                <p className="text-gray-900 font-medium">
                  Your current performance across key IELTS skills.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 pt-8 px-10">
                  <Card className="border-0 shadow-none">
                    <CardContent className="">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={moduleProgressData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="module"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#666" }}
                          />
                          <YAxis
                            domain={[0, 9]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#666" }}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="current"
                            fill="#3b82f6"
                            name="Score"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section data-aos="fade" className="p-4">
              <h1 className="text-2xl font-extrabold tracking-tighter">
                Upcoming <span className="text-blue-600">Milestones</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {milestones.map((item, i) => (
                  <div
                    key={i}
                    className="p-5  border-2 border-gray-100 rounded-md hover:scale-105 transition-all duration-300 bg-white "
                  >
                    <h1 className="text-md font-bold">IELTS Academic Test</h1>
                    <p className="pb-4 text-sm">
                      <i className="fa-regular fa-calendar-check"></i>{" "}
                      {item.date}
                    </p>
                    <p className="pb-4 text-sm">
                      Your next scheduled IELTS academic test will be at{" "}
                      {item.location}.
                    </p>
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      View Details
                    </Button>
                  </div>
                ))}


                {/*VE NHA LAM --------------------------------------------------------------------------------------------------------------- */}
                <div>
                  <FaPlusCircle className="text-5xl text-[#4b91e2]" />

                </div>
              </div>

            </section>

            {/* Section 5 */}
            <section data-aos="fade" className="p-4 tracking-tighter">
              <h1 className="text-2xl font-extrabold ">
                Recommended <span className="text-blue-600">Practice</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5 mx-1 lg:mx-40">
                {modules.map(({ img, title, desc, tags }, i) => (
                  <div
                    key={i}
                    className="rounded-2xl shadow-sm overflow-hidden bg-white"
                  >
                    <div className="relative w-full h-50">
                      <Image
                        src={img}
                        fill
                        alt={title}
                        className="object-cover"
                      />
                    </div>
                    <div className="px-8">
                      <h1 className="mt-4 text-md font-semibold py-3">
                        {title}
                      </h1>
                      <p className="pb-4 font-normal text-gray-700">{desc}</p>
                      <div>
                        {tags.map((tag, j) => (
                          <span
                            key={j}
                            className={`mr-1 py-1 px-2 rounded-2xl text-sm font-medium ${
                              j === 0 ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 my-6 w-full rounded-md">
                        Start Module
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6 */}
            <section data-aos="fade" className="p-4 tracking-tighter">
              <h1 className="text-2xl font-extrabold mb-10">
                Recent <span className="text-blue-500">Activity</span>
              </h1>
              <RecentAcivity></RecentAcivity>
            </section>
          </div>
        </main>
      </AuthGuard>

      <FooterUser></FooterUser>
      <ScrollTop></ScrollTop>
    </>
  );
}
