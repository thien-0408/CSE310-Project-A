'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInitializer({ children }: { children: React.ReactNode }) {
  // This useEffect will run on the client side
  useEffect(() => {
    AOS.init({
      duration: 500, 
      once: true,    
      offset: 100,   
    });
  }, []); 

  return (
    <>
      {children}
    </>
  );
}
