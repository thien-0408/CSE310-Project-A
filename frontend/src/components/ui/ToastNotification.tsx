"use client";
import { useState, useCallback, useRef } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"; 

type ToastType = "success" | "error" | "warning";

interface ToastState {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [notification, setNotification] = useState<ToastState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger noti
  const showToast = useCallback((message: string, type: ToastType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({ message, type });
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

const ToastComponent = () => {
    if (!notification) return null;

    const { message, type } = notification;

    const config = {
      success: {
        icon: <CheckCircle className="w-5 h-5" />,
        containerClass: "bg-white border-green-200 shadow-green-100",
        iconContainerClass: "bg-green-100 text-green-600",
        textClass: "text-slate-800",
      },
      error: {
        icon: <XCircle className="w-5 h-5" />,
        containerClass: "bg-white border-red-200 shadow-red-100",
        iconContainerClass: "bg-red-100 text-red-600",
        textClass: "text-slate-800",
      },
      warning: {
        icon: <AlertCircle className="w-5 h-5" />,
        containerClass: "bg-white border-amber-200 shadow-amber-100",
        iconContainerClass: "bg-amber-100 text-amber-600",
        textClass: "text-slate-800",
      },
    };

    const style = config[type];

    return (
      <div className="fixed top-6 right-6 z-[9999] animate-in fade-in slide-in-from-top-5 duration-300 ease-out">
        <div
          className={`
            flex items-start gap-4 p-4 min-w-[320px] max-w-md
            rounded-xl border shadow-lg ${style.containerClass}
            backdrop-blur-sm bg-opacity-95
          `}
        >
          <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${style.iconContainerClass}`}>
            {style.icon}
          </div>
          <div className="flex-1 pt-0.5">
            <p className={`text-sm font-medium leading-relaxed ${style.textClass}`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  };
  return { showToast, ToastComponent };
}