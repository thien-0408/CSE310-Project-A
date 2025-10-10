'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from "react-icons/fa";
import { Button } from '@/components/ui/button';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);


  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-20 right-5 z-50">
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="rounded-full hover:scale-105 bg-transparent shadow-lg w-15 h-15 hover:bg-gray-100 transition-all duration-200"
          aria-label="Scroll to top"
        >
        <FaArrowUp className=" text-black" />
        </Button>
      )}
    </div>
  );
}
