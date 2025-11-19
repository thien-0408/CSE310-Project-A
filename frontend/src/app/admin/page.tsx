"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield,
  Users,
  Settings,
  Activity,
  UserPlus,
  Plus,
  Trash2,
  Bell,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Headphones,
  FileAudio,
  FileText,
  HelpCircle,
  UserMinus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdAddCircleOutline } from "react-icons/md";
import { TbLivePhoto } from "react-icons/tb";
import { LiaBanSolid } from "react-icons/lia";
import { GoAlertFill } from "react-icons/go";

import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { IoLogOut } from "react-icons/io5";

//---------------------------------------
//Types
const LISTENING_QUESTION_TYPES = [
  "DiagramLabeling",
  "FormCompletion",
  "Map",
  "MatchingInformation",
  "MultipleChoice",
  "NoteCompletion",
  "ShortAnswer",
];

const READING_QUESTION_TYPES = [
  "DiagramCompletion",
  "GapFilling",
  "MatchingHeadings",
  "MatchingNames",
  "MultipleChoice",
  "SentenceCompletion",
  "ShortAnswer",
  "SummaryCompletion",
  "TableCompletion",
  "TrueFalseNotGiven",
  "YesNoNotGiven",
];

interface Question {
  id: number;
  questionType: string;
  questionText: string;
  answer: string;
  options?: string;
}

interface TestData {
  id: string;
  skill: "Reading" | "Listening";
  partNumber: number;
  resourceFile: File | null;
  resourceContent?: string;
  audioDuration?: number;
  questions: Question[];
}

interface User {
  id: string;
  userName: string;
  userRole: "User" | "Admin";
  isActived: boolean;
}
interface NotificationProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose?: () => void;
}
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

//-----------------------------------------------
// --- NOTIFICATION COMPONENT ---
const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  if (!message) return null;
  let iconComponent;
  switch (type) {
    case "success":
      iconComponent = <CheckCircle className="text-green-500" size={24} />;
      break;
    case "error":
      iconComponent = <XCircle className="text-red-500" size={24} />;
      break;
    case "warning":
      iconComponent = <AlertCircle className="text-yellow-500" size={24} />;
      break;
  }
  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5">
      <div className="bg-white rounded-lg shadow-xl border-l-4 border-l-current p-4 flex items-center gap-3 min-w-[300px]">
        <div
          className={`${
            type === "success"
              ? "text-green-500"
              : type === "error"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          {iconComponent}
        </div>
        <p className="text-gray-800 font-medium">{message}</p>
      </div>
    </div>
  );
};

//-------------------------------------------------
//Confirm modal
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
  isVisible,
}) => {
  if (!isVisible) return null;
  return (
    <div
      data-aos="fade"
      data-aos-duration="300"
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50"
    >
      <div className="bg-white rounded-2xl px-8 py-8 max-w-md w-full shadow-2xl border border-gray-200">
        <div className="flex flex-col items-center justify-center gap-5 border-b-2 border-gray-300 pb-2 ">
          <div className="p-4 bg-red-500 rounded-full">
            <GoAlertFill className="text-4xl text-white" />
          </div>
          <p className="font-semibold text-lg text-gray-600">Are you sure?</p>
        </div>
        <p className="text-center text-gray-700 mb-6 text-lg mt-5">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-3 rounded-3xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-2 border-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 rounded-3xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
//-----------------------------------------------
// --- ADD TEST TAB ---

const AddTestTab = () => {
  const [skill, setSkill] = useState<"Reading" | "Listening">("Listening");
  const [partNumber, setPartNumber] = useState<number>(1);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [resourceContent, setResourceContent] = useState<string>(""); // Reading passage
  const [questions, setQuestions] = useState<Question[]>([]);

  // Helper để reset form khi đổi skill
  useEffect(() => {
    setQuestions([]);
    setPartNumber(1);
    setResourceContent("");
    setAudioDuration(0);
  }, [skill]);

  const handleAddQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        questionType:
          skill === "Listening"
            ? LISTENING_QUESTION_TYPES[0]
            : READING_QUESTION_TYPES[0],
        questionText: "",
        answer: "",
      },
    ]);
  };

  const handleRemoveQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (
    id: number,
    field: keyof Question,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Render to server
    console.log("Submitting Test:", {
      skill,
      partNumber,
      audioDuration: skill === "Listening" ? audioDuration : undefined,
      resourceContent: skill === "Reading" ? resourceContent : undefined,
      questions,
    });
    alert(`Created ${skill} Test successfully! (Check console for data)`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MdAddCircleOutline className="text-blue-600" size={24} />
          Add New Test
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Create a new Reading or Listening test module.
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {/* Skill Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Skill
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSkill("Listening")}
                className={`flex-1 py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                  skill === "Listening"
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <Headphones size={24} />
                <span className="font-semibold">Listening</span>
              </button>
              <button
                type="button"
                onClick={() => setSkill("Reading")}
                className={`flex-1 py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                  skill === "Reading"
                    ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <BookOpen size={24} />
                <span className="font-semibold">Reading</span>
              </button>
            </div>
          </div>

          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Number
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={partNumber}
                onChange={(e) => setPartNumber(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {skill === "Listening" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio Duration (seconds)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={audioDuration}
                    onChange={(e) => setAudioDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                  <Activity
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
            ) : (
              <div className="md:col-span-2">
                {/* Placeholder for reading layout, usually doesn't have explicit duration */}
              </div>
            )}
          </div>

          {/* Resource Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {skill === "Listening" ? "Audio File" : "Passage Content"}
            </label>

            {skill === "Listening" ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer">
                <FileAudio className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload MP3/WAV file
                </p>

                {/*Edit input file here */}
                <p className="text-xs text-gray-400 mt-1">Max size: 10MB</p>
                <input type="file" />
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  rows={8}
                  value={resourceContent}
                  onChange={(e) => setResourceContent(e.target.value)}
                  placeholder="Paste reading passage text here..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition"
                ></textarea>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                  <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Or upload a PDF/Image of the passage
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Questions Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Questions ({questions.length})
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Question ID */}
                    <div className="md:col-span-1 flex justify-center pt-2">
                      <span className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
                        {index + 1}
                      </span>
                    </div>

                    {/* Question Type */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Type
                      </label>
                      <select
                        value={q.questionType}
                        onChange={(e) =>
                          handleQuestionChange(
                            q.id,
                            "questionType",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {(skill === "Listening"
                          ? LISTENING_QUESTION_TYPES
                          : READING_QUESTION_TYPES
                        ).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Answer */}
                    <div className="md:col-span-7 space-y-3">
                      {/* Question Text (Prompt) */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Question Prompt
                        </label>
                        <input
                          type="text"
                          value={q.questionText}
                          onChange={(e) =>
                            handleQuestionChange(
                              q.id,
                              "questionText",
                              e.target.value
                            )
                          }
                          placeholder="Enter the question content..."
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      {/* Actual Answer */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          value={q.answer}
                          onChange={(e) =>
                            handleQuestionChange(q.id, "answer", e.target.value)
                          }
                          placeholder="Enter correct answer"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-green-700 bg-green-50 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>

                      {/* Show Option field if Multiple Choice */}
                      {q.questionType === "MultipleChoice" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Options (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="A. Cat | B. Dog | C. Mouse"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) =>
                              handleQuestionChange(
                                q.id,
                                "options",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-gray-400 hover:text-red-500 transition p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  <HelpCircle className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No questions added yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-2.5 rounded-lg text-white font-medium shadow-md transition flex items-center gap-2 ${
                skill === "Listening"
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                  : "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
              }`}
            >
              <Save size={18} /> Save Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
//--------------------------------------------------------------------------
// --- 3. MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
  // Update: Added 'add-test' to state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [addUserName, setAddUserName] = useState<string>("");
  const [addUserPassword, setAddUserPassword] = useState<string>("");
  const [addUserRole, setAddUserRole] = useState<string>("");
  const [isAddUserLoading, setIsAddUserLoading] = useState<boolean>(false);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps>({
    isVisible: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  // ... (System Config State - Keeping as placeholder)

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";
  //Get user array
  const getAllUsers: string = `${apiUrl}/api/Admin/fetch-users`;
  const fetchUsers = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(getAllUsers, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const userData: User[] = await response.json();
      console.log(userData);
      setUsers(userData);
    } catch (err) {
      showNotification("Error fetching users", "error");
    }
  };
  const createAccount: string = `${apiUrl}/api/Admin/create-account`;
  const createUser = async (userData: {
    username: string;
    password: string;
    role: string;
  }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(createAccount, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          role: userData.role,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText.replace("Error creating user: ", ""));
      }

      const successMessage = await response.text();
      await fetchUsers();
      return successMessage;
    } catch (error) {
      throw error;
    }
  };

  //Deactivate user
  const handleDeactivateUser = async (userName: string) => {
    setConfirmModal({
      isVisible: true,
      message: `Deactivate user ${userName}?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("accessToken");

          const response = await fetch(
            `http://localhost:5151/api/Admin/deactivate-user/${userName}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          showNotification(`User ${userName} deactivated successfully`);
          if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to deactivate User");
          }
          fetchUsers();
          setConfirmModal((prev) => ({ ...prev, isVisible: false }));
        } catch (error) {
          console.error(error);
        }
      },
      onCancel: () =>
        setConfirmModal((prev) => ({ ...prev, isVisible: false })),
    });
  };

  //Activate user
  const handleActivateUser = async (userName: string) => {
    setConfirmModal({
      isVisible: true,
      message: `Activate user ${userName}?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(
            `http://localhost:5151/api/Admin/activate-user/${userName}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to activate User");
          }
          showNotification(`User ${userName} activated successfully`);
          fetchUsers(); //fetch again to render
        } catch (error) {
          console.error(error);
        } finally {
          setConfirmModal((prev) => ({ ...prev, isVisible: false }));
        }
      },
      onCancel: () =>
        setConfirmModal((prev) => ({ ...prev, isVisible: false })),
    });
  };

  //Logout and remove token
  const handleLogout = () => {
    setConfirmModal({
      isVisible: true,
      message: `Are you sure you want to log out?`,
      onConfirm: async () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            await fetch(`${apiUrl}/api/Auth/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (error) {
            console.error("There're something wrong");
          }
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      },
      onCancel: () =>
        setConfirmModal((prev) => ({ ...prev, isVisible: false })),
    });
  };

  const handleRemoveUser = async (userName: string) => {
    const userToRemove = users.find((u) => u.userName === userName);
    if (!userToRemove) return;

    setConfirmModal({
      isVisible: true,
      message: `This action cannot be undone. This will permanently remove "${userToRemove.userName}"`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(
            `http://localhost:5151/api/Admin/delete-user/${userName}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to delete user");
          }

          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.userName !== userName)
          );
          showNotification(
            `User ${userToRemove.userName} deleted successfully`,
            "success"
          );
        } catch (error) {
          showNotification(`Error deleting user`);
        } finally {
          setConfirmModal((prev) => ({ ...prev, isVisible: false }));
        }
      },
      onCancel: () =>
        setConfirmModal((prev) => ({ ...prev, isVisible: false })),
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!addUserName.trim()) {
      hasError = true;
      showNotification("Please enter a username", "error");
    }
    if (!addUserPassword.trim()) {
      hasError = true;
      showNotification("Please enter a password", "error");
    }
    if (!addUserRole) {
      hasError = true;
      showNotification("Please select a role", "error");
    }

    if (hasError) return;

    if (users.some((user) => user.userName === addUserName.toLowerCase())) {
      showNotification("A user with this username already exists", "error");
      return;
    }

    try {
      await createUser({
        username: addUserName,
        password: addUserPassword,
        role: addUserRole,
      });

      setAddUserName("");
      setAddUserPassword("");
      setAddUserRole("");

      showNotification(`User ${addUserName} created successfully!`, "success");
    } catch (error) {
      showNotification(`Error creating user: error`);
    } finally {
    }
  };
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActived).length;
  const inactiveUsers = users.filter((u) => !u.isActived).length;
  const admin = users.filter((u) => u.userRole === "Admin").length;

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleToggleUserStatus = (userName: string) => {
    const triggeredUser = users.find((user) => user.userName === userName);
    if (!triggeredUser) return;

    if (triggeredUser.isActived) {
      handleDeactivateUser(userName);
    } else {
      handleActivateUser(userName);
    }
  };
  // ----------------------------------------------------------------
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          /* Total User*/
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className=" p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 bg-gradient-to-br from-blue-500 to-purple-500 hover:scale-105 transition duration-300">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
              </div>
            </div>

            {/* Active users*/}
            <div className=" p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 bg-gradient-to-br from-green-500 to-teal-500 hover:scale-105  transition duration-300">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <TbLivePhoto size={24} />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Active Users</p>
                <h3 className="text-2xl font-bold text-white">{activeUsers}</h3>
              </div>
            </div>

            {/* Deactivate users */}
            <div className=" p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 transition duration-300">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <LiaBanSolid size={24} />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Inactive Users</p>
                <h3 className="text-2xl font-bold text-white">
                  {inactiveUsers}
                </h3>
              </div>
            </div>

            {/* Admin*/}
            <div className="p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:scale-105 duration-300">
              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Admin</p>
                <h3 className="text-2xl font-bold text-white">{admin}</h3>
              </div>
            </div>
          </div>
        );

      //------------------------------------------------------------------------------------------------
      //User management tab
      case "users":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                User Management
              </h2>

              {/* Form for adding new user */}
              <form
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                onSubmit={handleAddUser}
              >
                <input
                  type="text"
                  placeholder="Username"
                  className="px-4 py-3 border-2 border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-300"
                  value={addUserName}
                  onChange={(e) => setAddUserName(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="px-4 py-3 border-2 border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-300"
                  value={addUserPassword}
                  onChange={(e) => setAddUserPassword(e.target.value)}
                  required
                />
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-300"
                  value={addUserRole}
                  onChange={(e) => setAddUserRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff]  text-white font-medium flex items-center gap-2 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-400 transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                    isAddUserLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={isAddUserLoading}
                >
                  {isAddUserLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Plus size={18} /> Add User
                    </>
                  )}
                </button>
              </form>
            </div>
            <ConfirmModal
              isVisible={confirmModal.isVisible}
              message={confirmModal.message}
              onConfirm={confirmModal.onConfirm}
              onCancel={confirmModal.onCancel}
            />
            {/* Simple Table placeholder */}
            <div className="p-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-br from-gray-50 to-gray-100">
                    <th className="p-4 text-left font-semibold text-gray-700 text-sm">
                      Username
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 text-sm">
                      Role
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 text-sm">
                      Status
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-12 text-gray-500"
                      >
                        <Users size={48} className="mb-4 opacity-50" />
                        <p>No users found. Loading users...</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 transition duration-200"
                      >
                        <td className="p-4 font-medium text-black">
                          {user.userName}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              user.userRole === "User"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {user.userRole}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              user.isActived
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActived ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            className={`px-3 py-1.5 text-xs rounded-xl font-medium flex items-center gap-1 transition duration-300 ${
                              user.isActived
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            } ${
                              user.userRole === "Admin"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              handleToggleUserStatus(user.userName)
                            }
                            disabled={user.userRole === "Admin"}
                          >
                            {user.isActived ? (
                              <UserMinus size={18} />
                            ) : (
                              <UserPlus size={18} />
                            )}
                            {user.isActived ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className={`px-3 py-1.5 text-xs rounded-xl font-medium flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 transition duration-300 ${
                              user.userRole === "Admin"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleRemoveUser(user.userName)}
                            disabled={user.userRole === "Admin"}
                          >
                            <Trash2 size={18} />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      // --- CASE MỚI: ADD TEST ---
      case "add-test":
        return <AddTestTab />;

      case "settings":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                System Settings
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Settings form goes here...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Left sidebar
  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <ConfirmModal
        isVisible={confirmModal.isVisible}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />

      <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 fixed h-full z-10 transition-all duration-300 hidden lg:block">
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-white rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Image
                src={"/assets/logo.png"}
                alt="logo"
                width={100}
                height={100}
              ></Image>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                ISP AdminPanel
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                V1.0.0
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Activity
                size={20}
                className={
                  activeTab === "dashboard"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "users"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Users
                size={20}
                className={
                  activeTab === "users"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              />
              Users
            </button>

            {/* Add Test Button*/}
            <button
              onClick={() => setActiveTab("add-test")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "add-test"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Plus
                size={20}
                className={
                  activeTab === "add-test"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              />
              Add Test
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "settings"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Settings
                size={20}
                className={
                  activeTab === "settings"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              />
              Settings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-72 flex-1 p-8 overflow-y-auto h-screen">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "users" && "User Management"}
                {activeTab === "add-test" && "Create New Test"}
                {activeTab === "settings" && "System Configuration"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back, Administrator
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Header Actions (Notification, Avatar) */}
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                {/* <Image src="..." /> placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <p>A</p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleLogout}>
                        <IoLogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          {/* Content Render */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
