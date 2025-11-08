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
} from "@/components/ui/pagination";
import Link from "next/link";

type TestData = {
  id: number;
  testType: string;
  skill: string;
  image: string;
  views: number;
  passage: number;
  title: string;
  subtitle: string[];
  button: string;
};

// Skill filter
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

// Filtering array for test type
const filterTypes = [
  { id: "separated", label: "Separated Test" },
  { id: "full_test", label: "Full Test" },
];

const TESTS: TestData[] = [
  {
    id: 1,
    testType: "separated",
    skill: "reading",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "The Future of Urban Farming: Sustainable Cities and Agriculture",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 2,
    skill: "Reading",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 12,
    passage: 2,
    title:
      "The Psychology of Color: How Colors Influence Our Emotions and Decisions",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 3,
    skill: "Listening",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title:
      "The Rise of Artificial Intelligence in Healthcare: Opportunities and Challenges",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 4,
    skill: "Listening",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title:
      "Climate Change and the Oceans: Understanding the Impact on Marine Ecosystems",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 5,
    skill: "Reading",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
  {
    id: 6,
    skill: "Writing",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Recent Tests- VOL] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Matching Information", "Matching Names"],
    button: "Try Now!",
  },
];

const filterPassage = [1, 2, 3];

export default function TestSamplePage() {
  const [titleSearch, setTitleSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const handleFilterChange = (
    value: string,
    filterSet: Set<string>,
    setFilter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    const newSet = new Set(filterSet);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setFilter(newSet);
  };

  const filteredTests = TESTS.filter((test) => {
    const matchesTitle = test.title
      .toLowerCase()
      .includes(titleSearch.toLowerCase());
    const matchesSkill =
      selectedSkills.size === 0 || selectedSkills.has(test.skill.toLowerCase());
    const matchesType =
      selectedTypes.size === 0 ||
      selectedTypes.has(test.testType.toLowerCase());
    return matchesTitle && matchesSkill && matchesType;
  });

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
                    {filterSkills.map((filter) => (
                      <div key={filter.skill} className="flex items-center">
                        <Checkbox
                          id={`skill-${filter.skill}`}
                          onCheckedChange={() =>
                            handleFilterChange(
                              filter.skill.toLowerCase(),
                              selectedSkills,
                              setSelectedSkills
                            )
                          }
                          checked={selectedSkills.has(
                            filter.skill.toLowerCase()
                          )}
                        />
                        <Label
                          htmlFor={`skill-${filter.skill}`}
                          className="ml-2 text-sm font-medium cursor-pointer"
                        >
                          <div className="flex gap-2">
                            <div>{filter.icon}</div>
                            <div>{filter.skill}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Test Type</h3>
                  <div className="space-y-2 ml-2">
                    {filterTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <Checkbox
                          id={`type-${type.id}`}
                          onCheckedChange={() =>
                            handleFilterChange(
                              type.id,
                              selectedTypes,
                              setSelectedTypes
                            )
                          }
                          checked={selectedTypes.has(type.id)}
                        />
                        <Label
                          htmlFor={`type-${type.id}`}
                          className="ml-2 text-sm font-medium cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Passage (Difficulty)</h3>
                  <div className="space-y-2 ml-2">
                    {filterPassage.map((n) => (
                      <div key={n} className="flex items-center">
                        <Checkbox id={`passage-${n}`} />
                        <Label
                          htmlFor={`passage-${n}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          Passage {n}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <Button class5 w-full bg-blue-500 hover:bg-blue-700">
                  ApplyName="mt-
                </Button> */}
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
                {/* FIX 6: Render `filteredTests` thay vì `TESTS` */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
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
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 mt-10">
                      <p className="text-lg font-medium">No results found.</p>
                      <p>Try adjusting your search or filter criteria.</p>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </section>
      <footer>
        {/* Pagination nên được cập nhật logic dựa trên `filteredTests` */}
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
