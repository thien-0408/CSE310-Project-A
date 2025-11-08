"use client";
import "aos/dist/aos.css";
import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
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
import { MdQuickreply } from "react-icons/md";

import { useState } from "react";
export default function Listening() {
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
                    <span className="text-gray-900">Hear, Understand</span>
                    <br />
                    <span className="text-gray-900">and</span>
                    <br />
                    <span className="bg-gradient-to-r font-extrabold from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      Conquer
                    </span>
                  </h1>
                  <p className="text-gray-700 leading-relaxed max-w-2xl tracking-tighter">
                    Sharpen your listening skills with real exam recordings,
                    adjustable audio controls, and instant feedback. Build
                    confidence, accuracy, and speed — one session at a time.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Move to Listening
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
                      src="/assets/listening.jpg"
                      alt="IELTS Learning Illustration - Student studying with digital learning tools"
                      width={600}
                      height={600}
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
                What Our Listening Offers
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
                      Real Exam Experience
                    </CardTitle>
                    <CardDescription className=" font-medium leading-relaxed text-gray-600">
                      Practice with authentic IELTS-style recordings and timed
                      sections to build real exam confidence.
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
                      Smart Audio Controls
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Play, pause, replay, and adjust speed — train your ear at
                      your own pace
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
                      Diverse Question Types
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Experience all IELTS question formats: multiple choice,
                      map labeling, matching, and more.
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
                      Section-Based Practice
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Focus on Parts 1–4 individually or take full-length
                      listening tests.
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
                      <MdQuickreply className="text-[#4b91e2] text-5xl" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between ">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Instant Feedback & Scoring
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Get automatic band estimation and detailed explanation
                      after each test.
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
                      Track Your Progress
                    </CardTitle>
                    <CardDescription className="font-medium leading-relaxed text-gray-600">
                      Visualize your listening improvement with analytics and
                      score trends over time.
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
