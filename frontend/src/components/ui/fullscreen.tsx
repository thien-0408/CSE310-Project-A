// components/FullScreenButton.jsx

'use client'
import { BsFullscreen } from "react-icons/bs";

import { useState, useEffect } from 'react';

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleExit = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleExit);
    return () => {
      document.removeEventListener('fullscreenchange', handleExit);
    };
  }, []);

  const handleFullScreen = () => {
    const element = document.documentElement;

    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
  };

  return (
    <BsFullscreen className="text-md hover:cursor-pointer" onClick={handleFullScreen} />

  );
};

export default FullScreenButton;