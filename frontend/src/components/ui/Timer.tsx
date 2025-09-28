import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';

interface TimerProps {
  time: number; 
  onTimeUp?: () => void; 
  onTimeChange?: (remainingTime: number) => void; 
  autoStart?: boolean; 
  showWarning?: boolean; 
  warningTime?: number;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  time,
  onTimeUp,
  onTimeChange,
  autoStart = false,
  showWarning = true,
  warningTime = 300, //5 mins
  className = ""
}) => {
  const [remainingTime, setRemainingTime] = useState(time);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasEnded, setHasEnded] = useState(false);

  // Format thời gian thành HH:MM:SS
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Xử lý countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = prev - 1;
          
          // Callback when time changes
          if (onTimeChange) {
            onTimeChange(newTime);
          }
          
          // Check if time's up
          if (newTime === 0) {
            setIsRunning(false);
            setHasEnded(true);
            if (onTimeUp) {
              onTimeUp();
            }
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, remainingTime, onTimeUp, onTimeChange]);

  // Reset timer when props change
  useEffect(() => {
    setRemainingTime(time);
    setHasEnded(false);
    setIsRunning(autoStart);
  }, [time, autoStart]);

  const handleStart = () => {
    if (remainingTime > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setRemainingTime(time);
    setIsRunning(false);
    setHasEnded(false);
  };

  // Colors
  const getTimerColor = () => {
    if (hasEnded) return 'text-red-600';
    if (showWarning && remainingTime <= warningTime) return 'text-amber-600';
    return 'text-gray-800';
  };

  const getBackgroundColor = () => {
    if (hasEnded) return 'bg-red-50 border-red-200';
    if (showWarning && remainingTime <= warningTime) return 'bg-amber-50 border-amber-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className={`inline-flex items-center space-x-4 p-4 border-2 rounded-lg ${getBackgroundColor()} ${className}`}>
      {/* Icon Clock */}
      <div className="flex items-center space-x-2">
        {showWarning && remainingTime <= warningTime && remainingTime > 0 ? (
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        ) : (
          <Clock className="w-6 h-6 text-gray-600" />
        )}
        
        {/* Time display */}
        <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(remainingTime)}
        </span>
      </div>

      {/* Control buttons */}
      <div className="flex space-x-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={hasEnded}
            className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-full transition-colors"
            title="Start Timer"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center justify-center w-10 h-10 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
            title="Pause Timer"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center justify-center w-10 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* State */}
      {hasEnded && (
        <div className="flex items-center space-x-1 text-red-600 font-medium">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Time&apos;s Up!</span>
        </div>
      )}
    </div>
  );
};