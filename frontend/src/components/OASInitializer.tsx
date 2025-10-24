'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInitializer({ children }: { children: React.ReactNode }) {
  // This useEffect will run on the client side
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true,    // Animation only runs once
      offset: 100,   // Offset (px) from the original trigger point
    });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      {children}
    </>
  );
}
