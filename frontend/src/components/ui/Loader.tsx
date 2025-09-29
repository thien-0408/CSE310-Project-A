"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Loader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); 

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;
  
  return (
    <>
      <style jsx>{`
        .custom-loader {
          width: 50px;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 8px solid;
          border-color: #000 #0000;
          animation: l1 1s infinite;
        }
        
        @keyframes l1 {
          to {
            transform: rotate(.5turn);
          }
        }
      `}</style>
      
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-300 opacity-80 transition-opacity duration-500">
        <div className="custom-loader"></div>
      </div>
    </>
  );
}