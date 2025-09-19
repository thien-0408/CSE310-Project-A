"use client";
import { Button } from "@/components/ui/button";
import NavBarUser from "@/components/ui/navbarforuser";
import * as React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function UserDashBoard() {
  return (
    <>
      <NavBarUser></NavBarUser>
      <main className="p-10 px-30">
        {/*First section */}
        <section>
          {/**Big div for text & button */}
          <div className="mb-1">
            {/*Text div */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold mb-4">
                Master IELTS with
                <span className=" bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
                  {" "}
                  Confidence
                </span>
              </h1>
              <p className="">
                IELTS Sprint provides comprehensive practice tests, study
                materials, and <br /> personalized feedback to help you achieve
                your desired band score. Start your <br /> journey to global
                opportunities today!
              </p>
            </div>
            {/*Buttons div */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className=" bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md  "
              >
                <Link href={"/login"}>Start Practicing</Link>
              </Button>
              <Button
                type="submit"
                className="bg-white border font-bold border-gray-400 text-black hover:bg-gray-100"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div></div>
        </section>

        {/*Second section*/}
        <section className="py-10 bg-white mb-5">
          <div className=" mx-auto px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Card 1 - Personalized Learning */}
              <div className="text-center px-7 rounded-md shadow-sm hover:shadow-xl transition-all">
                <div className="p-8 mb-6 flex items-center justify-center h-60">
                  <div className="relative w-60 h-36  overflow-hidden">
                    <Image
                      src="/demo/personal-learning.jpg"
                      alt="Personalized learning"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Personalized Learning
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto mb-4">
                  Tailored study plans and content based on your strengths and
                  weaknesses for maximum progress.
                </p>
              </div>

              {/* Card 2 - Extensive Resources */}
              <div className="text-center px-7 rounded-md shadow-sm hover:shadow-xl transition-all">
                <div className=" p-8 mb-6 flex items-center justify-center h-60">
                  <div className="relative w-60 h-36  overflow-hidden">
                    <Image
                      src="/demo/extensive-resource.jpg"
                      alt="Extensive resources"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Extensive Resources
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto mb-4">
                  Access a vast library of practice questions, mock tests, and
                  detailed explanations for all modules.
                </p>
              </div>

              {/* Card 3 - Track Your Progress */}
              <div className="text-center px-7 rounded-md shadow-sm hover:shadow-xl transition-all">
                <div className="p-8 mb-6 flex items-center justify-center h-60">
                  <div className="relative w-60 h-36 bg-gray-100 px-7 overflow-hidden">
                    <Image
                      src="/demo/progress-tracking.jpg"
                      alt="Progress tracking"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Track Your Progress
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto mb-5">
                  Monitor your performance with insightful analytics and
                  visualize your improvement over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*Practice */}
        <section>
          <h1 className="text-3xl font-bold mb-5">
            Practice{" "}
            <span className="bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
              Modules
            </span>
          </h1>

          {/*Grid layout for 4 skills */}
          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/*Listening skill*/}
              <div>
                <Card className=" text-center flex flex-col rounded-sm border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-headphones text-[#4b91e2] text-5xl "></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Listening Practice
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600">
                      Improve your ability to understand spoken English.
                    </CardDescription>
                  </div>
                  <Progress value={0} className="bg-blue-400"></Progress>
                  <h2>70% Completed</h2>
                  <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                    Start Practice
                  </Button>
                </Card>
              </div>

              {/*Reading */}
              <div>
                <Card className=" text-center flex flex-col rounded-sm border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                  <div className="flex justify-center items-center ">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-book text-[#4b91e2] text-5xl "></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <CardTitle className="text-xl font-semibold leading-tight text-gray-900">
                      Reading Comprehension
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600">
                      Enhance your skills in analyzing and interpreting texts.
                    </CardDescription>
                  </div>
                  <Progress value={0} className="bg-blue-400"></Progress>
                  <h2>70% Completed</h2>
                  <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                    Start Practice
                  </Button>
                </Card>
              </div>

              {/*Speaking */}
              <div>
                <Card className=" text-center flex flex-col rounded-sm border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                  <div className="flex justify-center items-center ">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-pencil text-[#4b91e2] text-5xl "></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <CardTitle className="text-xl font-semibold leading-tight text-gray-900">
                      Reading Comprehension
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600">
                      Enhance your skills in analyzing and interpreting texts.
                    </CardDescription>
                  </div>
                  <Progress value={0} className="bg-blue-400"></Progress>
                  <h2>70% Completed</h2>
                  <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                    Start Practice
                  </Button>
                </Card>
              </div>

              {/*Writing */}
              <div>
                <Card className=" text-center flex flex-col rounded-sm border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                  <div className="flex justify-center items-center ">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-comments text-[#4b91e2] text-5xl "></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <CardTitle className="text-xl font-semibold leading-tight text-gray-900">
                      Reading Comprehension
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600">
                      Enhance your skills in analyzing and interpreting texts.
                    </CardDescription>
                  </div>
                  <Progress value={0} className="bg-blue-400"></Progress>
                  <h2>70% Completed</h2>
                  <Button className="bg-blue-400 hover:bg-blue-600 transition-all">
                    Start Practice
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/*Third section : Full mock test */}
        <section>
          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/*First card */}
              <div>
                <h1>This is first card</h1>
              </div>

              {/*Second card */}
              <div>
                <h1>This is second card</h1>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
