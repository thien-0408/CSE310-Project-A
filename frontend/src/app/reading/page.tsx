"use client";
import "aos/dist/aos.css";
import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import LoginModal from "@/components/ui/LoginModal";
import { PiFediverseLogoFill } from "react-icons/pi";
import { SiTestcafe } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import Footer from "@/components/ui/footer";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import ScrollTop from "@/components/ui/scroll-top";
import VenomBeam from "@/components/ui/venom-beam";
import { MdAudioFile } from "react-icons/md";
import { GiProgression } from "react-icons/gi";

import { useState } from "react";
export default function Reading() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <div className="top-0 z-50 w-full">
        <NavBar />
      </div>
      {/* Hero Banner Section */}
      <VenomBeam className="w-full relative overflow-hidden p-10 container mx-auto lg:p-40  ">
        <div>
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content Section */}
              <div
                data-aos="fade-right"
                className="flex flex-col space-y-8 text-left"
              >
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight">
                    <span className="text-gray-900">Read, Think</span>
                    <br />
                    <span className="text-gray-900">and</span>
                    <br />
                    <span className="bg-gradient-to-r font-extrabold from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      Succeed
                    </span>
                  </h1>
                  <p className="text-gray-700 leading-relaxed max-w-2xl tracking-tighter">
                    Build mastery in IELTS Reading with realistic passages, smart tools for highlighting and note-taking, and instant scoring. 
                    Strengthen your comprehension and accuracy step by step.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Move to Reading
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white bg-white/20 backdrop-blur-sm text-gray-800 hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Image Section */}
              <div
                data-aos="fade-left"
                className="flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl transform rotate-6"></div>
                  <div className="relative bg-gradient-to-br from-[#2c3e50] to-[#3498db] rounded-3xl p-8 shadow-2xl">
                    <Image
                      src="/assets/reading.jpg"
                      alt="IELTS Learning Illustration - Student studying with digital learning tools"
                      width={600}
                      height={480}
                      quality={100}
                      className="w-full h-auto max-w-lg rounded-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-xl"></div>
        </div>
      </VenomBeam>

      <main>
        {/*Benefit section*/}
        <section
          data-aos="fade-down"
          className="py-20 px-10 lg:px-40 tracking-tight"
        >
          <div className="container mx-auto px-6 lg:px-8 ">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-extrabold text-gray-900">
                What Our Reading Offers
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <SpotlightCard
                spotlightColor="34, 211, 238"
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="h-full text-center flex flex-col transition-shadow p-2">
                  <div className="flex justify-center items-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <SiTestcafe className="text-[#4b91e2] text-5xl" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between ">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Topic-Based <br /> Passages
                    </CardTitle>
                    <CardDescription className=" font-medium leading-relaxed text-gray-600">
                      Choose from a variety of topics and levels to match your interests and skill.
                    </CardDescription>
                  </div>
                </div>
              </SpotlightCard>
              {/* Card 2 */}
              <SpotlightCard
                spotlightColor="34, 211, 238"
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="h-full text-center flex flex-col transition-shadow p-2">
                  <div className="flex justify-center items-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <MdAudioFile className="text-[#4b91e2] text-5xl" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between ">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Authentic IELTS Formats
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Practice True/False/Not Given, Matching Headings, Summary Completion, and more.
                    </CardDescription>
                  </div>
                </div>
              </SpotlightCard>
              {/* Card 3 */}
              <SpotlightCard
                spotlightColor="34, 211, 238"
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="h-full text-center flex flex-col transition-shadow p-2">
                  <div className="flex justify-center items-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <PiFediverseLogoFill className="text-[#4b91e2] text-5xl" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between ">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Built-in Timer <br /> Tools
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Sharpen your time management with realistic countdown timers.
                    </CardDescription>
                  </div>
                </div>
              </SpotlightCard>
              {/* Card 4 */}
              <SpotlightCard
                spotlightColor="34, 211, 238"
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="h-full text-center flex flex-col transition-shadow p-2">
                  <div className="flex justify-center items-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-user-tie text-[#4b91e2] text-5xl"></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between ">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Highlight & Notes Feature
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Annotate texts, underline key ideas, and take digital notes while reading.
                    </CardDescription>
                  </div>
                </div>
              </SpotlightCard>
              {/* Card 5 */}
              <SpotlightCard
                spotlightColor="34, 211, 238"
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="h-full text-center flex flex-col transition-shadow p-2">
                  <div className="flex justify-center items-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <VscFeedback className="text-[#4b91e2] text-5xl" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between ">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Instant Scoring & Review
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Get immediate results with detailed answer explanations and difficulty analysis.
                    </CardDescription>
                  </div>
                </div>
              </SpotlightCard>
              {/* Card 6 */}

              <SpotlightCard
                spotlightColor="34, 211, 238"
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="h-full text-center flex flex-col transition-shadow p-2">
                  <div className="flex justify-center items-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <GiProgression className="text-[#4b91e2] text-5xl" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between ">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Personalized Study Analytics
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Identify weak areas, track reading speed, and monitor your score progress.
                    </CardDescription>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/*Student's comments */}

        {/*Success path*/}
        <section data-aos="fade-down">
          <div className="w-full bg-gray-50 flex flex-col items-center py-30 sm:flex-row lg:px-60 lg:py-30 p-10 tracking-tight">
            <div className="flex-1">
              {/**Image section */}
              <Image
                src="/assets/success-path.jpg"
                alt=""
                width={450}
                height={350}
                quality={100}
                className="rounded-md mb-4"
              ></Image>
            </div>

            <div className="flex-1">
              {/**Caption */}
              <div className="pb-4">
                <h1 className="text-3xl font-extrabold">Your Path to IELTS</h1>
                <span className="text-3xl font-extrabold">Success </span>
                <span className="text-3xl font-extrabold bg-gradient-to-r from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
                  Starts Here
                </span>
              </div>

              <div>
                <p>
                  Prepare with the best resources, designed by experts, to
                  ensure you are fully ready for every section of the IELTS
                  exam. Our platform adapts to your learning style, providing a
                  truly personalized experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer></Footer>
      <ScrollTop></ScrollTop>
    </>
  );
}
