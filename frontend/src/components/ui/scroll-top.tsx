'use client'
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const isBrowser = () => typeof window != 'undefined';

function handleClick() {
  if (!isBrowser) return;
  window.scrollTo({ top: 0, behavior: "smooth" })
}

export default function ScrollTop() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const className = (visible == true ? "flex items-center justify-center fixed w-[50px] h-[50px] md:bottom-20 md:right-20 text-[20px] leading-[50px] bottom-15 right-3 text-center rounded-full shadow-lg opacity-100 bg-white text-blue-600 animate-none md:animate-bounce" : "hidden");

  return (
    <>
      <div className={className} onClick={handleClick}>
        <FaArrowUp className="text-black" size={20} />
      </div>
    </>
  )
}