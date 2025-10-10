"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import NavBarUser from "@/components/ui/navbarforuser";
import { LuPencilLine } from "react-icons/lu";
import { FiBook } from "react-icons/fi";
import { HiOutlineMicrophone } from "react-icons/hi2";
import { SlEarphones } from "react-icons/sl";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

type TestData = {
  id: number;
  image: string;
  views: number;
  passage: number;
  title: string;
  subtitle: string[];
  button: string;
};
const filterSkills = [
  {
    skill: "Writing",
    icon: <LuPencilLine />,
  },
  {
    skill: "Reading",
    icon: <FiBook />,
  },
  {
    skill: "Listening",
    icon: <SlEarphones />,
  },
  {
    skill: "Speaking",
    icon: <HiOutlineMicrophone />,
  },
];
const TESTS: TestData[] = [
  {
    id: 1,
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 2,
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 3,
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 4,
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 5,
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 6,
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
];

// const filterWriting = ["Task 1", "Task 2"];

// const filterListening = ["Task 1", "Task 2", "Part 3", "Part 4"];
// const filterSpeaking = ["Part 1", "Part 2", "Part 3"];

const filterPassage = [1, 2, 3];

export default function TestSamplePage() {
  // Example filter states, can be expanded
  const [titleSearch, setTitleSearch] = useState("");

  return (
    <>
      <NavBarUser></NavBarUser>
      <section
        className="tracking-tight "
        style={{
          backgroundImage: `
        radial-gradient(circle at center, #2489bf 0%, transparent 70%)
      `,
          opacity: 0.9,
          mixBlendMode: "multiply",
        }}
      >
        <div className="">
          <div className="container mx-auto px-4 py-10">
            <div className="flex gap-8">
              {/* Sidebar Filter */}
              <aside className="w-72 rounded-lg border p-6 flex flex-col space-y-6">
                <div className="">
                  <h3 className="font-semibold mb-4">Skill</h3>
                  <div className="space-y-2 ml-2">
                    {filterSkills.map((filterSkills) => (
                      <div key={filterSkills.skill} className="flex">
                        <Checkbox id={`skill-${filterSkills.skill}`} />
                        <label
                          htmlFor={`skill-${filterSkills.skill}`}
                          className="ml-2 text-sm font-medium"
                        >
                          <div className="flex gap-2">
                            <div>{filterSkills.icon}</div>
                            <div>{filterSkills.skill}</div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Checkbox id="separated-test"></Checkbox>
                  <Label htmlFor="seprated-test font-medium">
                    Separated Test
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Checkbox id="full-test"></Checkbox>
                  <Label htmlFor="full-test font-medium">Full Test</Label>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Passage (Difficulty)</h3>
                  <div className="space-y-2 ml-2">
                    {filterPassage.map((n) => (
                      <div key={n}>
                        <Checkbox id={`passage-${n}`} />
                        <label
                          htmlFor={`passage-${n}`}
                          className="ml-2 text-sm"
                        >
                          Passage {n}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="mt-5 w-full bg-blue-500 hover:bg-blue-700">
                  Apply
                </Button>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      All Test <span className="text-blue-600">Samples</span>
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="font-semibold text-gray-700 px-2"
                    >
                      All
                    </Button>
                    <Input
                      placeholder="Enter title..."
                      className="w-64 border-2 border-gray-300 bg-white"
                      value={titleSearch}
                      onChange={(e) => setTitleSearch(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      className="ml-1 text-blue-400 font-bold px-2"
                    >
                      Search
                    </Button>
                  </div>
                </div>
                {/* Grid Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {TESTS.map((test) => (
                    <Card
                      key={test.id}
                      className="p-0 overflow-hidden rounded-xl border relative group hover:scale-105 transition-all duration-500"
                    >
                      <div className="relative h-40 w-full bg-gray-100">
                        <Image
                          src={test.image}
                          fill
                          className="object-cover rounded-t-xl"
                          alt={test.title}
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs rounded-full px-2 py-1 flex items-center gap-1">
                          <span>👁️</span>
                          <span>{test.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <Badge
                          variant="secondary"
                          className="mb-2"
                        >{`Passage ${test.passage}`}</Badge>
                        <CardTitle className="text-base font-bold leading-tight hover:text-blue-600">
                          {test.title}
                        </CardTitle>
                        <div className="text-xs text-gray-600 mt-2 space-y-1">
                          {test.subtitle.map((s, idx) => (
                            <div key={idx}>{s}</div>
                          ))}
                        </div>

                        <Link href={`/tests/${test.id}`}>
                          <Button
                            className="mt-3 w-full bg-white text-blue-400 border-2 border-blue-400 hover:bg-blue-400 hover:text-white"
                            size="sm"
                          >
                            {test.button}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </main>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <Pagination className="p-5 border-2 border-gray-300">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="/tests"
                isActive
                size={undefined}
                className="bg-blue-400 text-white "
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/tests/index/2" size={undefined}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="tests/index/3" size={undefined}>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="/tests/index/2"
                size={100}
                className="text-blue-500 ml-2"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </>
  );
}
