"use client";

import { FC, useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LuPencilLine } from "react-icons/lu";
import { FiBook } from "react-icons/fi";
import { HiOutlineMicrophone } from "react-icons/hi2";
import { SlEarphones } from "react-icons/sl";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from "@/components/ui/Loader";
import NavBar from "@/components/ui/navbar";
import { useRouter, useSearchParams } from "next/navigation";


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
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}
const filterSkills = [
  { skill: "Writing", icon: <LuPencilLine /> },
  { skill: "Reading", icon: <FiBook /> },
  { skill: "Listening", icon: <SlEarphones /> },
  { skill: "Speaking", icon: <HiOutlineMicrophone /> },
];
const filterTypes = [
  { id: "separated", label: "Separated Test" },
  { id: "full_test", label: "Full Test" },
];
const filterPassage = [1, 2, 3];

const TESTS: TestData[] = [
  // Page 1
  {
    id: 1,
    testType: "separated",
    skill: "reading",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Reading] - Digital Marketing Trends",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 2,
    skill: "listening",
    testType: "separated",
    image: "/testdata/listening.png",
    views: 12,
    passage: 2,
    title: "[Full Test] - Psychology of Color",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 3,
    skill: "writing",
    testType: "separated",
    image: "/testdata/writing.jpg",
    views: 13879,
    passage: 2,
    title: "[Listening] - Urban Migration",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 4,
    skill: "listening",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Full Test] - The History of Jazz",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 5,
    skill: "writing",
    testType: "separated",
    image: "/testdata/listening.png",
    views: 13879,
    passage: 2,
    title: "[Writing] - Task 1: Bar Chart",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 6,
    skill: "speaking",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Speaking] - Part 2: A Memorable Trip",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  // Page 2
  {
    id: 7,
    testType: "separated",
    skill: "reading",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Reading] - Artificial Intelligence",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 8,
    skill: "reading",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 12,
    passage: 2,
    title: "[Full Test] - Marine Biology",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 9,
    skill: "listening",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Listening] - University Lecture",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 10,
    skill: "listening",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Full Test] - Phone Conversation",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 11,
    skill: "writing",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Writing] - Task 2: Climate Change",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 12,
    skill: "speaking",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Speaking] - Part 1: Hobbies",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  // Page 3
  {
    id: 13,
    testType: "separated",
    skill: "reading",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Reading] - Sustainable Agriculture",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 14,
    skill: "reading",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 12,
    passage: 2,
    title: "[Full Test] - Renewable Energy",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 15,
    skill: "listening",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Listening] - Radio Broadcast",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 16,
    skill: "listening",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Full Test] - Guided Tour",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 17,
    skill: "writing",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Writing] - Task 1: Line Graph",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 18,
    skill: "speaking",
    testType: "separated",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Speaking] - Part 3: Technology",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  // Page 4
  {
    id: 19,
    testType: "separated",
    skill: "reading",
    image: "/testdata/reading.png",
    views: 13879,
    passage: 2,
    title: "[Reading] - The Pyramids",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
  {
    id: 20,
    skill: "reading",
    testType: "full_test",
    image: "/testdata/reading.png",
    views: 12,
    passage: 2,
    title: "[Full Test] - Ancient Civilizations",
    subtitle: ["Gap Filling", "Gap Filling", "Multiple Choice"],
    button: "Try Now!",
  },
];

const ITEMS_PER_PAGE = 6;

export default function ViewTests() {
  const router = useRouter();
  const [titleSearch, setTitleSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
   const searchParams = useSearchParams();
     const skillParam = searchParams.get("skill"); // ví dụ ?skill=listening

  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps>({
    isVisible: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  //hook for render skill
  useEffect(() => {
    if (skillParam) {
      setSelectedSkills(new Set([skillParam.toLowerCase()]));
    }
  }, [skillParam]);

  const ConfirmModal: FC<ConfirmModalProps> = ({
    message,
    onConfirm,
    onCancel,
    isVisible,
  }) => {
    if (!isVisible) return null;
    return (
      <div
        data-aos="fade"
        data-aos-duration="300"
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 backdrop-blur-sm transition-opacity duration-300"
      >
        <div className="bg-white rounded-4xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
          <p className="text-center text-gray-700 mb-6 text-lg">{message}</p>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-3 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={onConfirm}
            >
              Go To Login Page
            </button>
            <button
              className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  const handleTest = () => {
    setConfirmModal({
      isVisible: true,
      message: "Please Login",
      onConfirm: () => {
        router.push("/login");
      },
      onCancel: () =>
        setConfirmModal({
          isVisible: false,
          message: "",
          onConfirm: () => {},
          onCancel: () => {},
        }),
    });
  };
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
    setCurrentPage(1); // Reset về trang 1 khi filter
  };

  const filteredTests = TESTS.filter((test) => {
    const matchesTitle = test.title
      .toLowerCase()
      .includes(appliedSearch.toLowerCase()); // Lọc bằng appliedSearch
    const matchesSkill =
      selectedSkills.size === 0 || selectedSkills.has(test.skill.toLowerCase());
    const matchesType =
      selectedTypes.size === 0 ||
      selectedTypes.has(test.testType.toLowerCase());
    return matchesTitle && matchesSkill && matchesType;
  });

  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredTests.slice(startIndex, endIndex); // Cut current items
  const [isLoading, setLoading] = useState(false);

  // handle page navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(page);
        setLoading(false); // turn loader off
      }, 300);
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };
  if (isLoading) {
    return (
      <>
        <Loader></Loader>
      </>
    );
  }

  return (
    <>
    <NavBar></NavBar>
      <ConfirmModal
        isVisible={confirmModal.isVisible}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />
      <section className="tracking-tight">
        <div className="">
          <div className="container mx-auto px-4 py-10">
            <div className="flex gap-8">
              {/* Sidebar Filter */}
              <aside className="w-72 rounded-lg border p-6 flex flex-col space-y-6">
                {/* ... (Code filter của bạn giữ nguyên) ... */}
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
                      onClick={() => {
                        setTitleSearch("");
                        setAppliedSearch("");
                        setSelectedSkills(new Set());
                        setSelectedTypes(new Set());
                        setCurrentPage(1); // Reset trang
                      }}
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
                      onClick={() => {
                        setAppliedSearch(titleSearch);
                        setCurrentPage(1); // Reset page
                      }}
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Grid Display */}
                {filteredTests.length > 0 ? (
                  <div
                    data-aos="fade"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
                  >
                    {currentItems.map((test) => (
                      <Card
                        key={test.id}
                        className="p-0 overflow-hidden rounded-xl border relative group hover:scale-105 transition-all duration-500 flex flex-col" // Thêm flex flex-col
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
                        <CardContent className="p-3 flex flex-col flex-grow">
                          <div className="flex gap-1 items-center mb-2 ">
                            <Badge
                              variant="secondary"
                              className="p-2 rounded-full bg-blue-500 text-white hover:text-black"
                            >
                              {test.skill.charAt(0).toUpperCase() +
                                test.skill.slice(1)}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="p-2 w-20 rounded-full"
                            >{`Passage ${test.passage}`}</Badge>
                          </div>

                          <CardTitle className="text-base font-bold leading-tight hover:text-blue-600">
                            {test.title}
                          </CardTitle>
                          <div className="text-xs text-gray-600 mt-2 space-y-1">
                            {test.subtitle.map((s, idx) => (
                              <div key={idx}>{s}</div>
                            ))}
                          </div>

                          <div className="mt-auto">
                            {" "}
                            {/* Thêm mt-auto */}
                            <Button
                              className="mt-3 w-full bg-white text-blue-400 border-2 border-blue-400 hover:bg-blue-400 hover:text-white"
                              size="sm"
                              onClick={handleTest}
                            >
                              {test.button}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="col-span-full text-center text-gray-500 mt-10">
                    <p className="text-lg font-medium">No results found.</p>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      </section>
      <footer>
        {/*Panigation */}
        <Pagination className="p-5 border-2 border-gray-300">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size={150}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none text-gray-400"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Tạo các nút số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  size={undefined}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={currentPage === page}
                  className={
                    currentPage === page
                      ? "bg-blue-400 text-white cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none text-gray-400"
                    : "text-blue-500 ml-2 cursor-pointer"
                }
                size={150}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </>
  );
}
