'use client';
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
interface Props {
  id: number;
  question: string;
  options?: string[];
  onAnswerChange?: (answer: number) => void;
}

const defaultOptions = ["Yes", "No", "Not Given"];

const YesNoNotGiven: React.FC<Props> = ({ id, question, options = defaultOptions, onAnswerChange }) => {
  const storageKey = `question-ynng-${id}`;
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      const savedIndex = parseInt(saved, 10);
      setSelected(savedIndex);
      if (onAnswerChange) {
        onAnswerChange(savedIndex);
      }
    }
  }, [storageKey]);

  const handleChange = (value: string) => {
    const index = parseInt(value, 10);
    setSelected(index);
    localStorage.setItem(storageKey, index.toString());
    if (onAnswerChange) {
      onAnswerChange(index);
    }
  };

  return (
    <div className="p-4 mb-2">
        <h1>Do the following statements agree with the views of the writer in Reading Passage?</h1>
      <div className="grid grid-cols-[1fr_2fr] p-4 bg-[#f3f4f6] rounded-sm my-4 tracking-tight">
        <div className="space-y-2">
          <h2 className="font-bold text-[#407db9]">YES.</h2>
          <Separator></Separator>
          <h2 className="font-bold text-[#407db9]">NO.</h2>
          <Separator></Separator>
          <h2 className="font-bold text-[#407db9]">NOT GIVEN.</h2>
        </div>

        <div className="space-y-2 font-medium">
            <p>If the statement agrees with the views of the writer</p>
            <p>If the statement contradicts the views of the writer	</p>
            <p>If it is impossible to say what the writer thinks about</p>
        </div>
      </div>

      <p className="font-semibold mb-2">{id}. {question}</p>
      <select
        value={selected !== null ? selected : ""}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded p-2 font-medium"
      >
        {options.map((opt, i) => (
          <option key={i} value={i} className="text-left font-medium">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YesNoNotGiven;
