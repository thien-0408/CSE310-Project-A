'use client'
import { useState, useEffect, useRef } from "react"

export default function CustomCursor() {

  const cursorRef = useRef<HTMLElement>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);

  useEffect(() => {

    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        if (cursorRef.current) {
          // Set the transform property using the current mouse coordinates
          // translate3d is used for hardware acceleration
          cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsClicked(false);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      setIsWindowFocused(true);
    }

    const handleMouseLeave = (e: MouseEvent) => {
      setIsWindowFocused(false);
    }


    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
      document.body.style.cursor = 'default';
    };
  }, []);

  const cursorImage = (isClicked) ? '/assets/black-pointer.png' : '/assets/icons8-cursor-24.png';

  const cursorStyle = `fixed pointer-events-none z-50 transition-transform duration-20 ease-out bg-cover w-5 h-5`;

  return (
    <div ref={cursorRef as React.RefObject<HTMLDivElement>} className={cursorStyle} style={{
      top: "0",
      left: "0",
      backgroundImage: `url(${cursorImage})`,
      display: isWindowFocused ? 'block' : 'none'
    }}>
    </div>
  )
}