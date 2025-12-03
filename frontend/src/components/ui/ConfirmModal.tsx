"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  HelpCircle, 
  AlertCircle, 
  Loader2, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Định nghĩa các loại trạng thái
export type ConfirmStatus = "alert" | "ask" | "warning";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void; // Hàm đóng modal
  onConfirm: () => void; // Hàm thực thi hành động
  status: ConfirmStatus; // Loại thông báo
  title?: string; // Tiêu đề tùy chọn
  message: string; // Nội dung thông báo
  isLoading?: boolean; // Trạng thái đang xử lý (hiện spinner)
  confirmText?: string; // Chữ trên nút confirm (Mặc định: "Confirm")
  cancelText?: string; // Chữ trên nút cancel (Mặc định: "Cancel")
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  status,
  title,
  message,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation logic (Fade in/out)
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  // --- CẤU HÌNH GIAO DIỆN DỰA TRÊN STATUS ---
  const config = {
    alert: {
      icon: <AlertTriangle className="w-6 h-6" />,
      titleColor: "text-red-600",
      iconBg: "bg-red-100 text-red-600",
      buttonVariant: "destructive" as const, // Dùng style destructive của Button shadcn
      buttonClass: "bg-red-600 hover:bg-red-700 text-white",
      defaultTitle: "Critical Alert",
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      titleColor: "text-amber-600",
      iconBg: "bg-amber-100 text-amber-600",
      buttonVariant: "default" as const,
      buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
      defaultTitle: "Warning",
    },
    ask: {
      icon: <HelpCircle className="w-6 h-6" />,
      titleColor: "text-blue-600",
      iconBg: "bg-blue-100 text-blue-600",
      buttonVariant: "default" as const,
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
      defaultTitle: "Confirmation",
    },
  };

  const currentStyle = config[status];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop (Click ra ngoài để đóng) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={!isLoading ? onClose : undefined} 
      />

      {/* Modal Content */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 
          transform transition-all duration-300 scale-100 border border-gray-100
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
      >
        {/* Close Button (X) */}
        {!isLoading && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div className={`mb-4 p-3 rounded-full ${currentStyle.iconBg}`}>
            {currentStyle.icon}
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-2 ${currentStyle.titleColor}`}>
            {title || currentStyle.defaultTitle}
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-11"
            >
              {cancelText}
            </Button>
            
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-11 font-semibold shadow-md transition-all active:scale-95 ${currentStyle.buttonClass}`}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;