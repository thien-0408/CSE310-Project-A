"use client";
import { Button } from "@/components/ui/button";
import NavBarUser from "@/components/ui/navbarforuser";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import TestHistorySection from "@/components/ui/testhistory";
import FooterUser from "@/components/ui/footeruser";
import ScrollTop from "@/components/ui/scroll-top";

{
  /*Score */
}
const overallScoreData = [
  { name: "Listening", value: 7.5, color: "#3b82f6" },
  { name: "Reading", value: 7.0, color: "#e5e7eb" },
  { name: "Writing", value: 6.5, color: "#1f2937" },
  { name: "Speaking", value: 7.0, color: "#f59e0b" },
];

const scoreTrendData = [
  { month: "Jan", score: 6.0 },
  { month: "Feb", score: 6.2 },
  { month: "Mar", score: 6.5 },
  { month: "Apr", score: 6.8 },
  { month: "May", score: 7.0 },
  { month: "Jun", score: 7.2 },
];
const moduleProgressData = [
  { module: "Listening", current: 7.5, target: 8.0 },
  { module: "Reading", current: 7.0, target: 8.0 },
  { module: "Writing", current: 6.5, target: 7.5 },
  { module: "Speaking", current: 7.0, target: 7.5 },
];

const recentTestsData = [
  {
    test: "Test 1",
    listening: 7.0,
    reading: 6.5,
    writing: 6.0,
    speaking: 7.0,
    overall: 6.6,
  },
  {
    test: "Test 2",
    listening: 7.5,
    reading: 7.0,
    writing: 6.5,
    speaking: 7.0,
    overall: 7.0,
  },
  {
    test: "Test 3",
    listening: 8.0,
    reading: 7.5,
    writing: 7.0,
    speaking: 7.5,
    overall: 7.5,
  },
];
const COLORS = ["#3b82f6", "#e5e7eb", "#1f2937", "#f59e0b"];
const overallBandScore = 7.0; // Calculate average

export default function UserDashBoard() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <NavBarUser></NavBarUser>
      </div>
      <main
        className="p-10 lg:px-30 "
        style={{
          backgroundImage: `
        radial-gradient(circle at center, #2489bf 0%, transparent 70%)
      `,
          opacity: 0.9,
          mixBlendMode: "multiply",
        }}
      >
        <div className="container mx-auto">
          {/*First section */}
          {/*Practice */}
          <section className="mb-20">
            <h1 className="text-3xl font-bold mb-10 tracking-tighter">
              Practice <span className="text-blue-500">Modules</span>
            </h1>

            {/*Grid layout for 4 skills */}
            <div className="mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {/*Listening skill*/}
                <div className="rounded-lg border-2 border-gray-100 hover:scale-105 transition-transform duration-200">
                  <Card className=" text-center flex flex-col rounded-sm border-1 shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex justify-center items-center">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <i className="fa-solid fa-headphones text-[#4b91e2] text-5xl "></i>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <CardTitle className="text-md font-semibold mb-4 leading-tight text-gray-900">
                        Listening Practice
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600">
                        Improve your ability to understand spoken English.
                      </CardDescription>
                    </div>
                    <Progress value={0} className="bg-blue-400"></Progress>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">70% </span>Completed
                    </p>
                    <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                      Start Practice
                    </Button>
                  </Card>
                </div>

                {/*Reading */}
                <div className="rounded-lg border-2 border-gray-100 hover:scale-105 transition-transform duration-200">
                  <Card className=" text-center flex flex-col rounded-sm border-1 shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex justify-center items-center ">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <i className="fa-solid fa-book text-[#4b91e2] text-5xl "></i>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <CardTitle className="text-md font-semibold mb-4 leading-tight text-gray-900">
                        Reading Comprehension
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600">
                        Enhance skills in analyzing and interpreting texts.
                      </CardDescription>
                    </div>
                    <Progress value={0} className="bg-blue-400"></Progress>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">70% </span>Completed
                    </p>
                    <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                      Start Practice
                    </Button>
                  </Card>
                </div>

                {/*Writing */}
                <div className="rounded-lg border-2 border-gray-100 hover:scale-105 transition-transform duration-200">
                  <Card className=" text-center flex flex-col rounded-sm border-1 shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex justify-center items-center ">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <i className="fa-solid fa-pencil text-[#4b91e2] text-5xl "></i>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <CardTitle className="text-md font-semibold mb-4 leading-tight text-gray-900">
                        Academic Writing
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600">
                        Master essay structure and academic vocabulary.
                      </CardDescription>
                    </div>
                    <Progress value={0} className="bg-blue-400"></Progress>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">70% </span>Completed
                    </p>
                    <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                      Start Practice
                    </Button>
                  </Card>
                </div>

                {/*Speaking */}
                <div className="rounded-lg border-2 border-gray-100 hover:scale-105 transition-transform duration-200">
                  <Card className=" text-center flex flex-col rounded-sm border-1 shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex justify-center items-center ">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <i className="fa-solid fa-comments text-[#4b91e2] text-5xl "></i>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <CardTitle className="text-md font-semibold mb-4 leading-tight text-gray-900">
                        Speaking Fluency
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600">
                        Develop confidence and coherence.
                      </CardDescription>
                    </div>
                    <Progress value={0} className="bg-blue-400"></Progress>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">70% </span>Completed
                    </p>
                    <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                      Start Practice
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/*Third section : Full mock test */}
          <section className="mb-20">
            <h1 className="text-3xl font-bold mb-20 tracking-tighter">
              Full Mock <span className="text-blue-500">Tests</span>
            </h1>
            <div className="mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/*First card */}
                <div className=" hover:shadow-lg rounded-lg p-8 border-3 border-gray-100 hover:scale-105 transition-transform duration-200 bg-white">
                  <div className="text-md font-semibold mb-2">
                    <h3>Academic Test Simulation</h3>
                  </div>

                  <div className="px-5 mb-2 text-gray-600">
                    <p>
                      Comprehensive sections for all modules
                      <br />
                      Timed practice for realistic exam conditions
                      <br />
                      Detailed score report and feedback
                    </p>
                  </div>

                  {/*Buttons div */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <Badge className="bg-gray-200 text-black hover:text-white">
                        Advanced
                      </Badge>
                    </div>

                    <div>
                      <Button className="bg-white text-black hover:bg-gray-300 transition-all border-2">
                        Start Test
                      </Button>
                    </div>
                  </div>
                </div>

                {/*Second card */}
                <div className=" hover:shadow-lg rounded-lg p-8 border-3 border-gray-100 hover:scale-105 transition-transform duration-200 bg-white">
                  <div className="text-md font-semibold mb-2">
                    <h3>General Traning Test</h3>
                  </div>

                  <div className="px-5 mb-2 text-gray-600">
                    <p>
                      Focus on practical, everyday English scenarios
                      <br />
                      Realistic task-based questions
                      <br />
                      Applicable for immigration purposes
                    </p>
                  </div>

                  {/*Buttons div */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <Badge className="bg-gray-200 text-black hover:text-white">
                        Intermediate
                      </Badge>
                    </div>

                    <div>
                      <Button className="bg-white text-black hover:bg-gray-300 transition-all border-2">
                        Start Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            {/*Performance section*/}
            <h1 className="text-3xl font-bold tracking-tighter">
              Your Performance <span className="text-blue-600">Overview</span>
            </h1>
            <div className="py-16">
              <div className="container mx-auto px-6">
                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Overall Band Score - Donut Chart */}
                  <Card className="">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        Overall Band Score
                      </CardTitle>
                      <CardDescription>
                        Average scores across modules.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <ResponsiveContainer width={300} height={300}>
                            <PieChart>
                              <Pie
                                data={overallScoreData}
                                cx={150}
                                cy={150}
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {overallScoreData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>

                          {/* Center Score Display */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900">
                                {overallBandScore}
                              </div>
                              <div className="text-sm text-gray-500">
                                Overall
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        {overallScoreData.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center space-x-2"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm text-gray-700">
                              {item.name}
                            </span>
                            <span className="text-sm font-semibold ml-auto">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Score Trend - Line Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        Score Trend
                      </CardTitle>
                      <CardDescription>
                        Your IELTS score progression over time.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={scoreTrendData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#666" }}
                          />
                          <YAxis
                            domain={[5, 9]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#666" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                            activeDot={{
                              r: 6,
                              stroke: "#3b82f6",
                              strokeWidth: 2,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Module Progress - Bar Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        Module Progress
                      </CardTitle>
                      <CardDescription>
                        Current vs Target scores by module.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                          <Legend />
                          <Bar
                            dataKey="current"
                            fill="#3b82f6"
                            name="Current Score"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="target"
                            fill="#1f2937"
                            name="Target Score"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Recent Tests Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        Recent Tests
                      </CardTitle>
                      <CardDescription>
                        Your latest practice test results.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentTestsData.map((test, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {test.test}
                              </h4>
                              <span className="text-lg font-bold text-blue-600">
                                {test.overall}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              <div className="text-center">
                                <div className="text-gray-500">L</div>
                                <div className="font-medium">
                                  {test.listening}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">R</div>
                                <div className="font-medium">
                                  {test.reading}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">W</div>
                                <div className="font-medium">
                                  {test.writing}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">S</div>
                                <div className="font-medium">
                                  {test.speaking}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          24
                        </div>
                        <div className="text-sm text-gray-600">
                          Tests Completed
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          +1.2
                        </div>
                        <div className="text-sm text-gray-600">
                          Score Improvement
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          156h
                        </div>
                        <div className="text-sm text-gray-600">Study Time</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          89%
                        </div>
                        <div className="text-sm text-gray-600">
                          Goal Progress
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
          {/*Test history */}
          <section>
            <div className="">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
                Test <span className="text-blue-500">History</span>
              </h2>
            </div>
            <TestHistorySection></TestHistorySection>
          </section>
        </div>
      </main>
      <FooterUser></FooterUser>
      <ScrollTop></ScrollTop>
    </>
  );
}
