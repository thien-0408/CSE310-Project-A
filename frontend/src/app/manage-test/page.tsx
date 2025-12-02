"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Trash2,
  Search,
  BookOpen,
  Headphones,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface TestSummaryDto {
  testId: string;
  title: string;
  testType: string;
  skill: string;
  imageUrl: string;
  subTitle: string;
  button: string;
  testTaken: number;
}
interface NotificationProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose?: () => void;
}
export default function AdminTestManager() {
  const [tests, setTests] = useState<TestSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<TestSummaryDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  if (!message) return null;
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

  const currentStyle = config[type];

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in fade-in slide-in-from-top-5 duration-300 ease-out">
      <div
        className={`
          flex items-start gap-4 p-4 min-w-[320px] max-w-md
          rounded-xl border shadow-lg ${currentStyle.containerClass}
          backdrop-blur-sm bg-opacity-95
        `}
      >
        <div
          className={`
            flex-shrink-0 flex items-center justify-center 
            w-8 h-8 rounded-full ${currentStyle.iconContainerClass}
          `}
        >
          {currentStyle.icon}
        </div>

        <div className="flex-1 pt-0.5">
          <p className={`text-sm font-medium leading-relaxed ${currentStyle.textClass}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
  const API_BASE_URL = "http://localhost:5151/api/test";
  const showNotification = useCallback(
    (message: string, type: "success" | "error" | "warning" = "success") => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      setNotification({ message, type });
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification({ message: "", type: "success" });
      }, 3000);
    },
    []
  );
  // Fetch Data
  const fetchTests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/fetch-tests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTests(data);
      } else {
        console.error("Failed to fetch tests");
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Delete Logic
  const handleDeleteClick = (test: TestSummaryDto) => {
    setTestToDelete(test);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!testToDelete) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}/delete-test/${testToDelete.testId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTests((prev) =>
          prev.filter((t) => t.testId !== testToDelete.testId)
        );
        showNotification("Test deleted successfully.", "success");
        setIsDeleteOpen(false);
      } else {
        const errorMsg = await response.text();
        alert(`Failed to delete: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      showNotification("Error deleting test.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- 3. Filter Logic ---
  const filteredTests = tests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper render icon skill
  const getSkillIcon = (skill: string) => {
    if (skill.toLowerCase() === "reading")
      return <BookOpen className="w-4 h-4 mr-1" />;
    if (skill.toLowerCase() === "listening")
      return <Headphones className="w-4 h-4 mr-1" />;
    return null;
  };

  const getSkillColor = (skill: string) => {
    if (skill.toLowerCase() === "reading")
      return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
    if (skill.toLowerCase() === "listening")
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <>
    {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    <div className="p-6 space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Test Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage Reading and Listening tests.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tests..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={fetchTests} variant="outline" size="icon">
            <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Skill</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Taken</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" /> Loading data...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500"
                >
                  No tests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTests.map((test) => (
                <TableRow key={test.testId}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={
                          test.imageUrl.startsWith("http")
                            ? test.imageUrl
                            : `http://localhost:5151${test.imageUrl}`
                        }
                        alt="thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {test.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {test.subTitle}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex w-fit items-center ${getSkillColor(
                        test.skill
                      )}`}
                    >
                      {getSkillIcon(test.skill)}
                      <span className="capitalize">{test.skill}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-gray-600">
                    {test.testType.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-gray-600">
                    {test.testTaken.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(test)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" /> Delete Test
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the test{" "}
              <strong>&quot;{testToDelete?.title}&quot;</strong>?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
