"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface IELTSTimerProps {
  onTimeUpdate?: (seconds: number) => void;
  className?: string; // 1. Thêm định nghĩa kiểu cho className (dấu ? để không bắt buộc)
}

export default function IELTSTimer({ onTimeUpdate, className }: IELTSTimerProps) { // 2. Lấy className từ props
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, onTimeUpdate]);

  const hours = Math.floor(secondsElapsed / 3600);
  const mins = Math.floor((secondsElapsed % 3600) / 60);
  const secs = secondsElapsed % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    // 3. Áp dụng Template Literals để nối chuỗi class
    <div className={`flex flex-col items-center justify-center gap-2 ${className || ""}`}>
      <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 border border-blue-300 rounded-full shadow-sm min-w-[140px]">
        <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
        <span className="font-bold text-blue-700 text-md tracking-wider font-mono">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}