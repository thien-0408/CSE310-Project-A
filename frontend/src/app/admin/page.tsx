"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield,
  Users,
  Settings,
  Activity,
  UserMinus,
  UserPlus,
  Plus,
  Trash2,
  Server,
  Database,
  Bell,
  Mail,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
interface User {
  id: string;
  userName: string;
  userRole: "User" | "Admin";
  isActived: boolean;
}

interface SystemConfig {
  maxUsers: number;
  dataRetention: number;
  backupFrequency: string;
  maintenance: boolean;
  notifications: boolean;
  autoBackup: boolean;
  emailNotifications: boolean;
  systemStatus?: string;
  totalStorage?: string;
  lastBackup?: string;
}

interface NotificationProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  if (!message) return null;

  let iconComponent;
  switch (type) {
    case "success":
      iconComponent = <CheckCircle size={18} />;
      break;
    case "error":
      iconComponent = <XCircle size={18} />;
      break;
    case "warning":
      iconComponent = <AlertCircle size={18} />;
      break;
    default:
      iconComponent = <AlertCircle size={18} />;
  }

  return (
    <div
      className={`fixed top-20 right-5 px-6 py-4 rounded-full text-white font-medium z-50 shadow-2xl flex items-center gap-2 transition-transform duration-300 ${
        type === "success"
          ? "bg-gradient-to-br from-green-500 to-emerald-600"
          : type === "error"
          ? "bg-gradient-to-br from-red-500 to-rose-600"
          : "bg-gradient-to-br from-amber-500 to-orange-600"
      } transform translate-x-0`}
    >
      {iconComponent}
      {message}
    </div>
  );
};

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
        <p className="text-center text-gray-700 mb-6 text-lg">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  // const adminName = localStorage.getItem('username');
  const adminName = "IELTS Sprint Admin";

  const [users, setUsers] = useState<User[]>([]); //user array

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    maxUsers: 1000,
    dataRetention: 365,
    backupFrequency: "daily",
    maintenance: false,
    notifications: true,
    autoBackup: true,
    emailNotifications: false,
  });

  const [activeTab, setActiveTab] = useState<"users" | "config">("users");

  const [addUserName, setAddUserName] = useState<string>("");
  const [addUserPassword, setAddUserPassword] = useState<string>("");
  const [addUserRole, setAddUserRole] = useState<string>("");
  const [isAddUserLoading, setIsAddUserLoading] = useState<boolean>(false);

  const [configMaxUsers, setConfigMaxUsers] = useState<number>(
    systemConfig.maxUsers
  );
  const [configDataRetention, setConfigDataRetention] = useState<number>(
    systemConfig.dataRetention
  );
  const [configBackupFrequency, setConfigBackupFrequency] = useState<string>(
    systemConfig.backupFrequency
  );
  const [isConfigSaving, setIsConfigSaving] = useState<boolean>(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  }>({ message: "", type: "success" });
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps>({
    isVisible: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

  //Get user array
  const getAllUsers: string = `${apiUrl}/api/Admin/fetch-users`;
  const fetchUsers = async () => {
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

  //Create account
  const createAccount: string = `${apiUrl}/api/Admin/create-account`;
  const createUser = async (userData: {
    username: string;
    password: string;
    role: string;
  }) => {
    try {
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
    try {
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

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to deactivate User");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Activate user
  const handleActivateUser = async (userName: string) => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setConfirmModal({
      isVisible: true,
      message: `Are you sure you want to log out?`,
      onConfirm: () => {
        window.location.href = "/";
        localStorage.removeItem("accessToken");
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
      message: `Are you sure you want to permanently delete user "${userToRemove.userName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
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

  const handleToggleUserStatus = (userName: string) => {
    const triggeredUser = users.find((user) => user.userName === userName);
    if (!triggeredUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userName === userName) {
          const newEnabled = !user.isActived;
          showNotification(
            `User ${user.userName} ${
              newEnabled ? "activated" : "deactivated"
            } successfully`,
            "success"
          );
          return { ...user, enabled: newEnabled };
        }
        return user;
      })
    );

    if (triggeredUser.isActived) {
      handleDeactivateUser(userName);
    } else {
      handleActivateUser(userName);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
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

    if (users.length >= systemConfig.maxUsers) {
      showNotification(
        `Maximum user limit of ${systemConfig.maxUsers} reached`,
        "warning"
      );
      return;
    }

    setIsAddUserLoading(true);

    try {
      await createUser({
        username: addUserName,
        password: addUserPassword,
        role: addUserRole.toUpperCase(),
      });

      setAddUserName("");
      setAddUserPassword("");
      setAddUserRole("");

      showNotification(`User ${addUserName} created successfully!`, "success");
    } catch (error) {
      showNotification(`Error creating user: error`);
    } finally {
      setIsAddUserLoading(false);
    }
  };

  const handleToggleSwitch = (setting: keyof SystemConfig) => {
    setSystemConfig((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (configMaxUsers < 1 || configMaxUsers > 10000) {
      showNotification("Maximum users must be between 1 and 10,000", "error");
      return;
    }
    if (configDataRetention < 30 || configDataRetention > 3650) {
      showNotification(
        "Data retention must be between 30 and 3,650 days",
        "error"
      );
      return;
    }

    setIsConfigSaving(true);

    setTimeout(() => {
      setSystemConfig((prev) => ({
        ...prev,
        maxUsers: configMaxUsers,
        dataRetention: configDataRetention,
        backupFrequency: configBackupFrequency,
      }));
      setIsConfigSaving(false);
      showNotification("Configuration saved successfully!", "success");
    }, 1500);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActived).length;
  const inactiveUsers = users.filter((u) => !u.isActived).length;

  const updateSystemStatus = useCallback(() => {
    const status = systemConfig.maintenance ? "Maintenance" : "Online";
    const storageUsed = (users.length * 0.6).toFixed(1);
    const now = new Date();
    const lastBackup = new Date(
      now.getTime() - (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000
    );
    const hoursAgo = Math.floor(
      (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60)
    );

    setSystemConfig((prev) => ({
      ...prev,
      systemStatus: status,
      totalStorage: `${storageUsed} GB`,
      lastBackup: `${hoursAgo} hours ago`,
    }));
  }, [systemConfig.maintenance, users.length]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    updateSystemStatus();
  }, [users, systemConfig.maintenance, updateSystemStatus]);

  useEffect(() => {
    const interval = setInterval(updateSystemStatus, 30000);
    return () => clearInterval(interval);
  }, [updateSystemStatus]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        setActiveTab("users");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "2") {
        e.preventDefault();
        setActiveTab("config");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div
        className=" min-h-screen"
        style={{
          backgroundImage: `
           radial-gradient(circle at center, #93c5fd, transparent)
         `,
        }}
      >
        <Notification message={notification.message} type={notification.type} />

        <ConfirmModal
          isVisible={confirmModal.isVisible}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
        />

        <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-white">
                <Image
                  src="/assets/logo.png"
                  width={100}
                  height={100}
                  alt="IELTS Sprint Logo"
                ></Image>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin</h1>
                <p className="text-sm text-gray-500">IELTS Sprint</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Hello, {adminName}!</span>
              <button
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff]  text-white font-medium hover:scale-105 transition duration-300"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="relative left-1/2 -translate-x-1/2 w-xl bg-white rounded-full p-4 shadow-2xl mb-6 flex justify-center gap-2">
            <button
              className={`flex items-center gap-2 p-4 rounded-full font-medium transition-all duration-300 ${
                activeTab === "users"
                  ? " bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white shadow-lg"
                  : "bg-transparent text-black"
              } hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:text-white  hover:-translate-y-1`}
              onClick={() => setActiveTab("users")}
            >
              <Users size={18} />
              User Management
            </button>

            <button
              className={`flex items-center gap-2 p-4 rounded-full font-medium transition-all duration-300 ${
                activeTab === "config"
                  ? " bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white shadow-lg"
                  : "bg-transparent text-black"
              } hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:text-white  hover:-translate-y-1`}
              onClick={() => setActiveTab("config")}
            >
              <Settings size={18} />
              Add Test
            </button>

            <button
              className={`flex items-center gap-2 p-4 rounded-full font-medium transition-all duration-300 ${
                activeTab === "config"
                  ? " bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white shadow-lg"
                  : "bg-transparent text-black"
              } hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:text-white  hover:-translate-y-1`}
              onClick={() => setActiveTab("config")}
            >
              <Settings size={18} />
              System Config
            </button>
          </div>

          <div className={`${activeTab !== "users" ? "hidden" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="px-10 p-6 rounded-3xl text-white shadow-2xl flex items-center justify-between bg-gradient-to-br from-blue-500 to-purple-500 hover:scale-105 transition duration-300">
                <div>
                  <h3 className="text-sm opacity-80 font-medium mb-1">
                    Total Users
                  </h3>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users size={24} />
              </div>

              <div className="px-10 p-6 rounded-3xl text-white shadow-2xl flex items-center justify-between bg-gradient-to-br from-green-500 to-teal-500 hover:scale-105  transition duration-300">
                <div>
                  <h3 className="text-sm opacity-80 font-medium mb-1">
                    Active Users
                  </h3>
                  <p className="text-2xl font-bold">{activeUsers}</p>
                </div>
                <Activity size={24} />
              </div>
              <div className="px-10 p-6 rounded-3xl text-white shadow-2xl flex items-center justify-between bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 transition duration-300">
                <div>
                  <h3 className="text-sm opacity-80 font-medium mb-1">
                    Inactive Users
                  </h3>
                  <p className="text-2xl font-bold">{inactiveUsers}</p>
                </div>
                <UserMinus size={24} />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 mb-6 ">
              <div className="flex items-center gap-2 mb-6">
                <UserPlus size={18} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New User
                </h3>
              </div>
              <form
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                onSubmit={handleAddUserSubmit}
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
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
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

            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 overflow-x-auto">
              <div className="flex items-center gap-2 mb-6">
                <Users size={18} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  User Management
                </h3>
              </div>
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

          <div className={`${activeTab !== "config" ? "hidden" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-6 rounded-3xl text-white shadow-2xl flex items-center justify-between bg-gradient-to-br from-green-500 to-teal-500 hover:scale-105 hover:shadow-xl transition duration-300">
                <div>
                  <h3 className="text-sm opacity-80 font-medium mb-1">
                    System Status
                  </h3>
                  <p className="text-2xl font-bold">
                    {systemConfig.systemStatus}
                  </p>
                </div>
                <Server size={24} />
              </div>
              <div className="p-6 rounded-3xl text-white shadow-2xl flex items-center justify-between bg-gradient-to-br from-cyan-500 to-blue-500 hover:scale-105 hover:shadow-xl transition duration-300">
                <div>
                  <h3 className="text-sm opacity-80 font-medium mb-1">
                    Total Test
                  </h3>
                  <p className="text-2xl font-bold">
                    {systemConfig.totalStorage}
                  </p>
                </div>
                <Database size={24} />
              </div>
              <div className="p-6 rounded-3xl text-white shadow-2xl flex items-center justify-between bg-gradient-to-br from-purple-500 to-indigo-500 hover:scale-105 hover:shadow-xl transition duration-300">
                <div>
                  <h3 className="text-sm opacity-80 font-medium mb-1">
                    Last Backup
                  </h3>
                  <p className="text-2xl font-bold">
                    {systemConfig.lastBackup}
                  </p>
                </div>
                <Shield size={24} />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 ">
              <div className="flex items-center gap-2 mb-6">
                <Settings size={18} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  System Configuration
                </h3>
              </div>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={handleConfigSubmit}
              >
                <div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="max-users"
                    >
                      Maximum Users
                    </label>
                    <input
                      type="number"
                      id="max-users"
                      className="px-4 py-3 border-2 border-gray-200 rounded-full text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-300"
                      value={configMaxUsers}
                      onChange={(e) =>
                        setConfigMaxUsers(parseInt(e.target.value) || 0)
                      }
                      min="1"
                      max="10000"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="data-retention"
                    >
                      Data Retention (days)
                    </label>
                    <input
                      type="number"
                      id="data-retention"
                      className="px-4 py-3 border-2 border-gray-200 rounded-full text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-300"
                      value={configDataRetention}
                      onChange={(e) =>
                        setConfigDataRetention(parseInt(e.target.value) || 0)
                      }
                      min="30"
                      max="3650"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="backup-frequency"
                    >
                      Backup Frequency
                    </label>
                    <select
                      id="backup-frequency"
                      className="px-4 py-3 border-2 border-gray-200 rounded-full text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition duration-300"
                      value={configBackupFrequency}
                      onChange={(e) => setConfigBackupFrequency(e.target.value)}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Settings
                  </label>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl mb-3 flex justify-between items-center hover:translate-x-1 transition duration-300">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Settings size={18} />
                      Maintenance Mode
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full cursor-pointer transition duration-300 ${
                        systemConfig.maintenance
                          ? "bg-gradient-to-br from-blue-500 to-purple-500"
                          : "bg-gray-300"
                      }`}
                      onClick={() => handleToggleSwitch("maintenance")}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${
                          systemConfig.maintenance
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl mb-3 flex justify-between items-center hover:translate-x-1 transition duration-300">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Bell size={18} />
                      Push Notifications
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full cursor-pointer transition duration-300 ${
                        systemConfig.notifications
                          ? "bg-gradient-to-br from-blue-500 to-purple-500"
                          : "bg-gray-300"
                      }`}
                      onClick={() => handleToggleSwitch("notifications")}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${
                          systemConfig.notifications
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl mb-3 flex justify-between items-center hover:translate-x-1 transition duration-300">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Database size={18} />
                      Auto Backup
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full cursor-pointer transition duration-300 ${
                        systemConfig.autoBackup
                          ? "bg-gradient-to-br from-blue-500 to-purple-500"
                          : "bg-gray-300"
                      }`}
                      onClick={() => handleToggleSwitch("autoBackup")}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${
                          systemConfig.autoBackup
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex justify-between items-center hover:translate-x-1 transition duration-300">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail size={18} />
                      Email Notifications
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full cursor-pointer transition duration-300 ${
                        systemConfig.emailNotifications
                          ? "bg-gradient-to-br from-blue-500 to-purple-500"
                          : "bg-gray-300"
                      }`}
                      onClick={() => handleToggleSwitch("emailNotifications")}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${
                          systemConfig.emailNotifications
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </form>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-medium flex items-center gap-2 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-700 transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                    isConfigSaving ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={isConfigSaving}
                  onClick={handleConfigSubmit}
                >
                  {isConfigSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={18} /> Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
