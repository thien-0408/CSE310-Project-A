"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Question = {
  id: number;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: "What does the writer say about the performance of older typists on the test?",
    options: [
      "They used different motor skills from younger typists.",
      "They had been more efficiently trained than younger typists.",
      "They used more time-saving techniques than younger typists.",
      "They had better concentration skills than younger typists."
    ]
  },
  {
    id: 2,
    question: "The experiment with the rats showed that",
    options: [
      "A brain structure only changed when the rats were given a familiar toy",
      "The rats became anxious after a lengthy period of time alone",
      "The rats lived longer then they were part of a social group",
      "The rats' brains expanded or shrank depending on the level of mental activity"
    ]
  },
  {
    id: 3,
    question: "A comparison between adults and children who played chess showed that",
    options: [
      "The children were as capable as the adults of remembering a series of numbers",
      "The children had better recall of the layout of pieces",
      "The adults stored memories of chess moves in a more logical manner",
      "The adults had clearer memories of chess games they had played"
    ]
  }
];

export default function ReadingTest() {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});

  const handleOptionChange = (questionId: number, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: option }));
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header Banner */}
      <Card className="mb-6 rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 flex items-center justify-between">
          <div>
            <small className="font-semibold text-white mb-1 block">Reading Passage 1</small>
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              How the mind ages
            </h1>
          </div>
          <div className="relative w-40 h-40 rounded-xl overflow-hidden">
            <Image
              src="/reading/banner-image.jpg"
              alt="Reading banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Card>
      
      {/* Description */}
      <p className="italic text-gray-500 mb-10">--- Description ---</p>
      <p className="mb-4 text-gray-700">
        The way mental function changes is largely determined by three factors—mental lifestyle, the impact of chronic disease and flexibility of the mind.
      </p>
      <p className="mb-4 text-gray-700">
        Experiments have shown that younger monkeys consistently outperform their older colleagues on memory tests...
      </p>
      <p className="mb-10 text-gray-700">
        {/* Continue with rest of passage */}
      </p>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Questions 1-3</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.map(({ id, question, options }) => (
            <div key={id} className="mb-6 last:mb-0">
              <p className="font-semibold mb-2">{id}. {question}</p>
              <RadioGroup
                value={selectedOptions[id] || ""}
                onValueChange={(value) => handleOptionChange(id, value)}
                className="space-y-2"
              >
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`${id}-option-${idx}`}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`${id}-option-${idx}`}
                      className="text-sm text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Pagination controls */}
          <div className="mt-8 flex items-center justify-center space-x-2 select-none">
            <Button variant="outline" size="sm" disabled>
              &lt;
            </Button>
            {[1,2,3,4,5,6,7,8,9,10].map(page => (
              <Button
                key={page}
                variant={page === 4 ? "default" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm">
              &gt;
            </Button>
          </div>

          <div className="mt-4 text-gray-600 text-sm text-center">
            Part 1: 0 of 13 questions &nbsp;&nbsp; Part 2: 0 of 13 questions &nbsp;&nbsp; Part 3: 0 of 14 questions
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
