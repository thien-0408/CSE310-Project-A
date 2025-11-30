"use client";

import { useState, useEffect, FC, ChangeEvent, FormEvent, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import NavBarUser from "@/components/ui/navbarforuser";
import { RiCloseCircleFill } from "react-icons/ri";

import AuthGuard from "@/components/auth/AuthGuard";
import { IoCamera } from "react-icons/io5";
import { FaBellSlash } from "react-icons/fa";

// --- Types ---
export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  bio?: string;
  targetScore?: number;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  role?: string;
}

interface ChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
}

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error";
}

// --- Helper Components ---
interface IconProps {
  icon: string;
  className?: string;
}
const Icon: FC<IconProps> = ({ icon, className }) => (
  <i className={`fas ${icon} ${className}`}></i>
);

// --- API Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("edit-profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Toast Handler ---
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Fetch Profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        showToast("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- Handle Profile Updates ---
  const handleProfileUpdate = async (updatedData: UserProfile, file: File | null) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        showToast("Not authenticated", "error");
        return;
    }

    const formData = new FormData();
    formData.append("FullName", updatedData.fullName || "");
    formData.append("Email", updatedData.email || "");
    
    if (updatedData.bio) formData.append("Bio", updatedData.bio);
    if (updatedData.phoneNumber) formData.append("PhoneNumber", updatedData.phoneNumber);
    if (updatedData.targetScore) formData.append("TargetScore", updatedData.targetScore.toString());
    if (updatedData.dateOfBirth) formData.append("DateOfBirth", updatedData.dateOfBirth);

    if (file) {
      formData.append("Avatar", file);
    } else {
      // NOTE: If your backend strictly requires an Avatar for every update, keep this check.
      // If it allows partial updates without avatar, you can remove this block.
      showToast("Please re-upload or confirm your Avatar image to save changes.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        showToast("Profile updated successfully!", "success");
        // Refresh local state
        setProfile((prev) => prev ? { ...prev, ...updatedData } : null);
      } else {
        const msg = await response.text();
        showToast(`Update failed: ${msg}`, "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("An error occurred while updating profile.", "error");
    }
  };

  // --- Handle Password Change ---
  const handlePasswordChange = async (data: ChangePasswordRequest) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      if (response.ok) {
        showToast("Password changed successfully", "success");
      } else {
        showToast(result || "Failed to change password", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Network error", "error");
    }
  };

  if (loading) return <div className="">Loading profile...</div>;
  if (!profile) return <div className="p-10 text-center text-xl bg-red-500 text-white rounded-2xl">Please log in to view profile.</div>;

  return (
    <>
      <NavBarUser />
      
      {/* Toast Container */}
      <div className="fixed top-24 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center w-80 p-4 rounded-lg shadow-lg text-white transition-all duration-300 animate-in slide-in-from-right-10 ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <RiCloseCircleFill />

            </button>
          </div>
        ))}
      </div>

      <div
        className="min-h-screen bg-gray-50 text-gray-800"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(219,234,254,0.7) 30%, rgba(165,180,252,0.5) 60%, rgba(129,140,248,0.6) 100%),
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%)
          `,
        }}
      >
        <div data-aos = "fade-right" data-aos-duration = "500" className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tighter">
            Profile{" "}
            <span className="bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
              Settings
            </span>
          </h1>

          <AuthGuard>
            <div className="flex flex-col md:flex-row md:space-x-8">
              {/* Sidebar */}
              <aside className="md:w-1/4 mb-8 md:mb-0">
                <ul className="space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <SidebarLink
                    icon="fa-user-edit"
                    label="Edit Profile"
                    isActive={activeTab === "edit-profile"}
                    onClick={() => setActiveTab("edit-profile")}
                  />
                  <SidebarLink
                    icon="fa-shield-alt"
                    label="Password & Security"
                    isActive={activeTab === "security"}
                    onClick={() => setActiveTab("security")}
                  />
                  <SidebarLink
                    icon="fa-bell"
                    label="Notifications"
                    isActive={activeTab === "notifications"}
                    onClick={() => setActiveTab("notifications")}
                  />
                </ul>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="rounded-xl bg-white p-6 sm:p-8 shadow-md border border-gray-100">
                  {activeTab === "edit-profile" && (
                    <EditProfileForm profile={profile} onSubmit={handleProfileUpdate} />
                  )}
                  {activeTab === "security" && (
                    <SecurityTab onSubmit={handlePasswordChange} />
                  )}
                  {activeTab === "notifications" && <NotificationsTab />}
                </div>
              </main>
            </div>
          </AuthGuard>
        </div>
      </div>
    </>
  );
}

// --- Components ---

const SidebarLink: FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({
  icon,
  label,
  isActive,
  onClick,
}) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center space-x-3 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
        isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-white hover:shadow-sm"
      }`}
    >
      <Icon icon={icon} className="w-5 text-center" />
      <span>{label}</span>
    </button>
  </li>
);

interface EditProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: UserProfile, file: File | null) => void;
}

const EditProfileForm: FC<EditProfileFormProps> = ({ profile: initialProfile, onSubmit }) => {
  const [formData, setFormData] = useState<UserProfile>(initialProfile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
     initialProfile.avatarUrl 
      ? (initialProfile.avatarUrl.startsWith("http") ? initialProfile.avatarUrl : `${API_BASE_URL}/${initialProfile.avatarUrl}`)
      : "/default-avatar.png"
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      targetScore: Number(formData.targetScore)
    };
    onSubmit(dataToSend, selectedFile);
  };

  // Logic to determine if changes have been made
  const hasChanges = useMemo(() => {
    // 1. If a new file is selected, it's a change
    if (selectedFile) return true;

    // 2. Compare fields
    const normalize = (val: unknown) => (val === null || val === undefined ? "" : String(val));
    
    // Check specific fields relevant to the update DTO
    if (normalize(formData.fullName) !== normalize(initialProfile.fullName)) return true;
    if (normalize(formData.email) !== normalize(initialProfile.email)) return true;
    if (normalize(formData.bio) !== normalize(initialProfile.bio)) return true;
    if (normalize(formData.phoneNumber) !== normalize(initialProfile.phoneNumber)) return true;
    
    // Compare dates (format YYYY-MM-DD vs potentially full ISO from API)
    const formDate = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : "";
    const initDate = initialProfile.dateOfBirth ? new Date(initialProfile.dateOfBirth).toISOString().split('T')[0] : "";
    if (formDate !== initDate) return true;

    // Compare numbers
    if (Number(formData.targetScore) !== Number(initialProfile.targetScore)) return true;

    return false;
  }, [formData, selectedFile, initialProfile]);

  const ieltsScores = Array.from({ length: 19 }, (_, i) => (i * 0.5).toFixed(1));

  return (
    <form data-aos = "fade-left" data-aos-duration = "500" onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-500">Update your photo and personal details.</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center space-x-6 border-t pt-6 bg-blue-50/50 p-4 rounded-lg">
        <div className="relative h-24 w-24">
            <Image
            src={previewUrl}
            alt="Avatar"
            fill
            className="rounded-full object-cover border-4 border-white shadow-sm"
            />
        </div>
        <div>
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50"
          >
            <IoCamera className="mr-2 text-2xl" />
            Change Photo
          </label>
          <input
            id="avatar-upload"
            name="avatar-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>

      {/* Target Score */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-xl text-white shadow-lg">
        <div>
          
            <h3 className="font-bold text-lg">IELTS Target Band (Current Target: {formData.targetScore})</h3>
            <p className="text-blue-100 text-sm">Set your goal to get personalized plans.</p>
        </div>
        <div className="flex items-center bg-white rounded-lg px-3 py-1">
            <span className="text-gray-500 mr-2 font-bold">Band:</span>
            <select 
                name="targetScore"
                value={formData.targetScore}
                onChange={handleInputChange}
                className="bg-transparent text-blue-700 font-bold text-2xl focus:outline-none cursor-pointer"
            >
                {ieltsScores.map(score => (
                    <option className="font-semibold text-black" key={score} value={score}>{score}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        <InputField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
        />
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <InputField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber || ""}
          onChange={handleInputChange}
          placeholder="+84..."
        />
        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Your Bio</label>
        <textarea
          name="bio"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
          value={formData.bio || ""}
          onChange={handleInputChange}
          placeholder="Tell us about your learning journey..."
        ></textarea>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          disabled={!hasChanges}
          className={`rounded-md px-6 py-2 text-sm font-medium text-white shadow-sm transition-all
            ${hasChanges 
                ? "bg-blue-500 hover:bg-blue-700" 
                : "bg-gray-400 cursor-not-allowed opacity-50"
            }`}
        >
          {hasChanges ? "Save Profile Changes" : "No Changes to Save"}
        </Button>
      </div>
    </form>
  );
};

interface SecurityTabProps {
  onSubmit: (data: ChangePasswordRequest) => void;
}

const SecurityTab: FC<SecurityTabProps> = ({ onSubmit }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      // We can use a prop callback or context for toast here, 
      // but for simplicity in this component structure, we might rely on HTML validation 
      // or passed down handlers. Assuming parent handles the API logic toast.
      // Ideally, pass a specific onError handler. 
      // For this implementation, I will rely on standard Alert for client-side validation failures
      // inside this sub-component to keep props simple, or you can pass setToast down.
      alert("New passwords do not match."); 
      return;
    }
    if (passwords.newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    onSubmit({
        CurrentPassword: passwords.currentPassword,
        NewPassword: passwords.newPassword
    });
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Check if form is filled to enable button
  const isFormValid = passwords.currentPassword && passwords.newPassword && passwords.confirmPassword;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-900">Password & Security</h2>
      <p className="mt-1 text-sm text-gray-500">Ensure your account is using a strong password.</p>
      
      <div className="space-y-6 border-t pt-6 mt-6">
        <InputField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={passwords.currentPassword}
          onChange={handleChange}
        />
        <InputField
          label="New Password"
          name="newPassword"
          type="password"
          value={passwords.newPassword}
          onChange={handleChange}
        />
        <InputField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={passwords.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end pt-6 mt-6">
        <Button
          type="submit"
          disabled={!isFormValid}
          className={`rounded-md px-6 py-2 text-sm font-medium text-white shadow-sm transition-all
            ${isFormValid 
                ? "bg-blue-500 hover:bg-blue-700" 
                : "bg-gray-400 cursor-not-allowed opacity-50"
            }`}
        >
          Update Password
        </Button>
      </div>
    </form>
  );
};

const NotificationsTab = () => (
  <div className="text-center py-10">
    <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
      <FaBellSlash className="text-gray-400 text-3xl" />
    </div>
    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
    <p className="mt-1 text-gray-500">Notification settings are currently under development.</p>
  </div>
);

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: FC<InputFieldProps> = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
    />
  </div>
);