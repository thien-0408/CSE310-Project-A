"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";

interface IELTSCountdownTimerProps {
  minutes: number;
  onTimeUp?: () => void;
  showWarning?: boolean;
}

export default function IELTSCountdownTimer({
  minutes,
  onTimeUp,
  showWarning = true,
}: IELTSCountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(minutes * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp]);

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
//   const percentage = (timeRemaining / (minutes * 60)) * 100;

  const isWarningTime = timeRemaining <= 300 && timeRemaining > 60; // 5 minutes warning
  const isCriticalTime = timeRemaining <= 60; // Last minute critical
  const isTimeUp = timeRemaining === 0;

  // Helper để hiển thị thời gian
  const formattedTime = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center gap-2 ">
      {/* Status Messages */}
      <div className="w-full max-w-xs">
        {isTimeUp ? (
          <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-300 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-600">Time&apos;s Up!</span>
          </div>
        ) : isCriticalTime ? (
          // ĐÃ THÊM ĐỒNG HỒ VÀO ĐÂY
          <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-300 rounded-md animate-pulse">
            <Clock className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-600">
              Final Minute! ({formattedTime})
            </span>
          </div>
        ) : isWarningTime && showWarning ? (
          // ĐÃ SỬA LẠI CHO RÕ RÀNG HƠN
          <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 border border-amber-300 rounded-md">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-600">
              {formattedTime}
            </span>
          </div>
        ) : (
          // ĐÃ THÊM ĐỒNG HỒ VÀO ĐÂY
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-300 rounded-md">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-600">
              {formattedTime}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {/* <div className="w-full max-w-xs">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
          <div
            className={`h-full transition-all duration-1000 ${
              isCriticalTime ? "bg-red-500": isWarningTime
                ? "bg-amber-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div> */}
    </div>
  );
}
