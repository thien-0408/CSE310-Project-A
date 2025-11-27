"use client";

import React from "react";
import FooterUser from "@/components/ui/footeruser";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaUsers, FaGlobeAsia, FaCheckCircle, FaGraduationCap } from "react-icons/fa";
import NavBar from "@/components/ui/navbar";

export default function AboutUsPage() {
  return (
    <>
      <NavBar></NavBar>
      <main  className="min-h-screen bg-white">
        
        {/* --- SECTION 1: HERO --- */}
        <section data-aos = "fade-right" data-aos-duration = "500" className="relative bg-blue-50 py-20 px-6 mb-10">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Master IELTS with <span className="text-blue-600">Confidence</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              We bridge the gap between preparation and success. Our platform provides realistic mock tests, 
              AI-driven analytics, and expert resources to help you achieve your dream band score.
            </p>
            <div className="flex justify-center gap-4">
               <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:-translate-y-1">
                 <Link href="/view-test">Start Practicing Free</Link>
               </Button>
               
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
        </section>

        {/* --- SECTION 2: STATS --- */}
        <section data-aos = "fade-left" data-aos-duration = "500" className="py-12 border-b border-gray-100 mb-10">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatItem number="50k+" label="Active Learners" icon={<FaUsers />} />
              <StatItem number="120+" label="Countries" icon={<FaGlobeAsia />} />
              <StatItem number="1M+" label="Tests Taken" icon={<FaCheckCircle />} />
              <StatItem number="7.5" label="Avg. Band Score" icon={<FaGraduationCap />} />
            </div>
          </div>
        </section>

        {/* --- SECTION 3: OUR STORY / MISSION --- */}
        <section data-aos = "flip-up" data-aos-duration = "300" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/teamwork.png" 
                  alt="Our Team working" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Our Story</h4>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Built by Teachers, Powered by Technology.</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Founded in 2023, IELTS Practice started with a simple observation: students were spending too much money on outdated textbooks and expensive centers, yet still failing to understand their mistakes.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We gathered a team of certified IELTS examiners and top-tier software engineers to build a solution that offers <strong>instant feedback</strong>. We believe that practice doesn&apos;t just make perfect—it makes permanent. That&apos;s why accuracy is our obsession.
                </p>
                <ul className="space-y-3">
                  <ListItem text="Real exam simulation interface" />
                  <ListItem text="Updated question bank every month" />
                  <ListItem text="Community-driven support" />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: THE TEAM --- */}
        <section data-aos="flip-right" className="py-20 bg-gray-50 px-6">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Minds Behind the Platform</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16">
              A diverse group of educators, developers, and designers united by a passion for education.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TeamMember 
                name="Trong Serum" 
                role="Head of Education" 
                desc="Former IELTS Examiner (10 years) and Cambridge certified tutor."
                image="/assets/huy-serum.jpg"
              />
              <TeamMember 
                name="Cena Nguyen" 
                role="Lead Developer" 
                desc="Full-stack wizard ensuring your test experience is bug-free and fast."
                image="/assets/bing-chilling.png"
                
              />
              <TeamMember 
                name="Jack Chau" 
                role="Content Strategist" 
                desc="Curates the most recent speaking topics and reading materials."
                image="/assets/jack-97.jpeg"
              />
            </div>
          </div>
        </section>

        {/* --- SECTION 5: CTA --- */}
        <section data-aos = "zoom-in" className="py-20 px-6">
          <div className="container mx-auto max-w-4xl bg-blue-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
             {/* Abstract Circles */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

             <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to hit your Target Band?</h2>
             <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto relative z-10">
               Join thousands of students who have already achieved their study abroad dreams.
             </p>
             <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-6 rounded-lg text-lg relative z-10">
               <Link href="/register">Create Free Account</Link>
             </Button>
          </div>
        </section>

      </main>
      <FooterUser />
    </>
  );
}

// --- SUB-COMPONENTS ---

function StatItem({ number, label, icon }: { number: string, label: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-blue-500 text-3xl mb-3 opacity-80">{icon}</div>
      <h3 className="text-4xl font-extrabold text-gray-900 mb-1">{number}</h3>
      <p className="text-gray-500 font-medium">{label}</p>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center text-gray-700">
      <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 text-xs">
        <FaCheckCircle />
      </span>
      {text}
    </li>
  );
}

function TeamMember({ name, role, desc, image }: { name: string, role: string, desc: string, image: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-24 h-24 mx-auto relative mb-4">
        {/* Placeholder for avatar */}
        <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden relative">
           <Image src={image} alt={name} fill className="object-cover" /> 
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <p className="text-blue-600 font-medium text-sm mb-3 uppercase tracking-wide">{role}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}