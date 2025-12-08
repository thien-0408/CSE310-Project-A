"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WritingFeedbackModal, { SubmissionDetail } from "./WritingFeedbackModal";

interface NotificationItem {
  submissionId: string;
  testTitle: string;
  score: number;
  gradedDate: string;
  isRead: boolean;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<SubmissionDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleClickNotification = async (submissionId: string) => {
    setIsModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(`${apiUrl}/api/writing-test/user-submission/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setModalData(data);
      } else {
        console.error("Failed to fetch submission detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch(`${apiUrl}/api/user/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          setUnreadCount(data.length); 
        }
      } catch (error) {
        console.error("Noti fetch error", error);
      }
    };

    fetchNotifications();
    
  }, [apiUrl]);

  return (
    <>
    <WritingFeedbackModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        loading={isLoadingDetail}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none relative">
          <div className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-gray-200 rounded-xl">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">
                {/* Mark all as read */}
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <DropdownMenuItem
                  key={item.submissionId}
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleClickNotification(item.submissionId); 
                    
                  }}
                  className="p-4 cursor-pointer focus:bg-blue-50 border-b border-gray-50 last:border-0 flex gap-3 items-start"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <CheckCircle2 size={20} />
                    </div>
                    {/* Giả sử logic check unread */}
                    {!item.isRead && (
                       <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                          <div className="w-2 h-2 bg-transparent" />
                       </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-800 leading-snug">
                      Your essay for <span className="font-semibold">{item.testTitle}</span> has been graded.
                    </p>
                    <p className="text-xs font-semibold text-blue-600">
                      Score: {item.score.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(item.gradedDate), { addSuffix: true })}
                    </p>
                  </div>

                  {!item.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </div>
          
          <div className="p-2 border-t border-gray-100 text-center">
              <button className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors w-full py-1">
                  View all history
              </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      
    </>
  );
}