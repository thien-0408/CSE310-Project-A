"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Users,
  Settings,
  Activity,
  UserPlus,
  Plus,
  Trash2,
  Bell,
  UserMinus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbLivePhoto } from "react-icons/tb";
import { LiaBanSolid } from "react-icons/lia";
import { GoAlertFill } from "react-icons/go";
import Image from "next/image";
import { IoLogOut } from "react-icons/io5";
import CreateReadingTest from "../add-reading/page";
import AdminTestManager from "../manage-test/page";
import { useToast } from "@/components/ui/ToastNotification";
import AdminWritingGrading from "@/components/ui/WritingManagement";
import { FaPenAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import CreateWritingTest from "@/components/ui/AddWritingTest";
//---------------------------------------
interface User {
  id: string;
  userName: string;
  userRole: "User" | "Admin";
  isActived: boolean;
}
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}
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
  return (
    <div className="bg-white  border-gray-100 overflow-hidden">
      <CreateReadingTest></CreateReadingTest>
    </div>
  );
};
//--------------------------------------------------------------------------
// --- 3. MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const { showToast, ToastComponent } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      showToast("Error fetching users", "error");
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
          showToast(`User ${userName} deactivated successfully`, "success");
          if (!response.ok) {
            showToast(`Error deactivating user ${userName}`, "error");
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
            showToast(`Error activating user ${userName}`, "error");
            const error = await response.text();
            throw new Error(error || "Failed to activate User");
          }
          showToast(`User ${userName} activated successfully`, "success");
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
          showToast(
            `User ${userToRemove.userName} deleted successfully`,
            "success"
          );
        } catch (error) {
          showToast(`Error deleting user`, "error");
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
      showToast("Please enter a username", "error");
    }
    if (!addUserPassword.trim()) {
      hasError = true;
      showToast("Please enter a password", "error");
    }
    if (!addUserRole) {
      hasError = true;
      showToast("Please select a role", "error");
    }

    if (hasError) return;

    if (users.some((user) => user.userName === addUserName.toLowerCase())) {
      showToast("A user with this username already exists", "error");
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

      showToast(`User ${addUserName} created successfully!`, "success");
    } catch (error) {
      showToast(`Error creating user: error`, "error");
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
          <>
            {/*Total users */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
              <ToastComponent></ToastComponent>
              <div className=" p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 bg-gradient-to-br from-blue-500 to-purple-500 hover:scale-105 transition duration-300">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Total Users</p>
                  <h3 className="text-2xl font-bold text-white">
                    {totalUsers}
                  </h3>
                </div>
              </div>

              {/* Active users*/}
              <div className=" p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 bg-gradient-to-br from-green-500 to-teal-500 hover:scale-105  transition duration-300">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                  <TbLivePhoto size={24} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Active Users</p>
                  <h3 className="text-2xl font-bold text-white">
                    {activeUsers}
                  </h3>
                </div>
              </div>

              {/* Deactivate users */}
              <div className=" p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 transition duration-300">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <LiaBanSolid size={24} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    Inactive Users
                  </p>
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

            <AdminTestManager></AdminTestManager>
          </>
        );
      //------------------------------------------------------------------------------------------------
      //User management tab
      case "users":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ToastComponent></ToastComponent>

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

      // --- ADD TEST ---
      case "add-test":
        return <AddTestTab />;
      case "grading":
        return <AdminWritingGrading></AdminWritingGrading>;
      case "add-writing":
        return <CreateWritingTest/>
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
            <div className="h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="p-4">A</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleLogout}>
                          <IoLogOut />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
            <div>
              <h1 className="text-md font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Admin Dashboard
              </h1>
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
              Add Reading Test
            </button>

            {/* Add Writing Button*/}
            <button
              onClick={() => setActiveTab("add-writing")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "add-writing"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Plus
                size={20}
                className={
                  activeTab === "add-writing"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              />
              Add Writing Test
            </button>

            {/* Grading test*/}
            <button
              onClick={() => setActiveTab("grading")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === "grading"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <FaPenAlt
                size={20}
                className={
                  activeTab === "grading"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              />
              Grading
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
        <main className="lg:ml-72 px-3  flex-1 overflow-y-auto h-screen">
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
