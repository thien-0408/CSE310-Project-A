"use client";
import { Button } from "@/components/ui/button";
import NavbarTest from "@/components/ui/navbarfortest";
import { useRef, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";

export default function ReadingTest() {
  const [leftWidth, setLeftWidth] = useState(50); // passage's % width
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        span.className = "bg-yellow-300 font-bold"; //custom color here
        try {
          range.surroundContents(span);
        } catch (err) {
          console.warn("Can't highlight complex text!");
        }
        selection.removeAllRanges();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return (
    <>
      <NavbarTest></NavbarTest>
      <div className="flex h-screen overflow-hidden">
        {/* Passage */}
        <div
          className="overflow-y-auto p-6 border-r"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="text-3xl font-extrabold text-center p-10 text-white  italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] ">
            <h1>Can the Planets coral reefs be saved?</h1>
          </div>
          <h2 className="text-xl font-bold mb-4">Reading Passage 1</h2>
          <p id="reading-passage" className="font-medium">
            Stanley Rapoport at the National Institute of Health in the United
            States measured the flow of blood in the brains of old and young
            people as they completed different tasks. S ince blood flow reflects
            neural activity, Rapoport could compare which networks of neurons
            were the same, the neural networks they used were significantly
            different. The older subjects used different inter nal strategies to
            accomplish comparable results at the same time, Rapoport says. At
            the Georgia Institute of Technology, psychologist Timothy Salthouse
            compared a group of fast and accurate typists of college age with
            ano ther group in their 60s. Both groups typed 60 words a minute.
            The older typists, it turned out, achieved their speed w ith cunning
            little strategies that made them more efficient than their younger
            counterparts. They made fewer finger shift s, gaining a fraction of
            a second here and there. They also read ahead in the test. The
            neural networks involved in typing appear to have been reshaped to
            compensate for losses in motor skills or other age changes.
          </p>
        </div>

        {/* Divider <Resize> */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-500"
        ></div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold mb-4">Questions</h3>
          {/* Question list*/}
        </div>
      </div>
    </>
  );
}
