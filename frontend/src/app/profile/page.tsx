"use client";

import { useState, useEffect } from "react";
import type { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import NavBarUser from "@/components/ui/navbarforuser";
import ConfirmModal from "@/components/ui/ModelConfirm";
import { UserProfile } from "@/types/userProfile";
interface IconProps {
  icon: string;
  className?: string;
}
const Icon: FC<IconProps> = ({ icon, className }) => (
  <i className={`fas ${icon} ${className}`}></i>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("edit-profile");
  
  const [profile, setProfile] = useState<UserProfile | null>(null);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  //API get profile
    const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";
    async function getUserProfile(token: string): Promise<UserProfile | null> {
      const endpoint: string = `${apiUrl}/api/Auth/profile`;
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`, 
          },
        });
    
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unexpected error' }));
          console.error(`Error ${response.status} when getting profile:`, errorBody);
          return null;
        }
        const data: UserProfile = await response.json();
        console.log(data);
        
        return data;
    
      } catch (error) {
        console.error("Error when trying to connect:", error);
        return null;
      }
    }
    function getStoredToken(): string | null {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken'); 
      }
      return null;
    }
  useEffect(() => {
      // Call API in useeffect
      async function loadUserProfileData() {
        const token = getStoredToken(); 
        setLoading(true); 
  
        if (!token) {
          console.warn("Can't find token");
          setError(true);
          setLoading(false);
          return;
        }
        
        console.log("Loading profile with token...");
  
        const userProfile = await getUserProfile(token); 
        
        if (userProfile) {
          console.log("Profile loaded");
          setProfile(userProfile);
        } else {
          console.error("Fail to load profile");
          setError(true);
        }
        setLoading(false); 
      }
  
      loadUserProfileData();
    }, []); 
  
  const handleConfirmAction = () => {
    console.log("Action confirmed!");
    // call api to edit
  };
  //update pass
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
 const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setProfile((prev) => {
    // 💡 KIỂM TRA QUAN TRỌNG: Nếu prev là NULL, không làm gì cả, trả về NULL.
    if (!prev) {
      console.warn("Không thể cập nhật input: Profile chưa được tải.");
      return null;
    }

    // Nếu prev tồn tại, thực hiện spread an toàn
    return { 
      ...prev, 
      [name]: value 
    };
  });
};

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newAvatar = reader.result as string;

        setProfile((prev) => {
          if (!prev) {
            // 💡 KIỂM TRA QUAN TRỌNG: Nếu prev là NULL, 
            // KHÔNG thể spread, phải trả về một UserProfile mặc định
            // (hoặc null nếu bạn không muốn cập nhật state)

            // Nếu bạn muốn hiển thị hình ảnh đã chọn ngay cả khi chưa có profile:
            // Bạn phải định nghĩa một UserProfile default hợp lệ TẠM THỜI
            // (Đảm bảo tất cả các trường string/number/Guid đều có giá trị mặc định)
            return {
              id: 'temp-id', // Phải có giá trị string/Guid hợp lệ
              userName: '',
              role: '',
              fullName: '',
              email: '',
              bio: '',
              targetScore: 0,
              phoneNumber: '',
              dateOfBirth: new Date().toISOString(),
              avatar: newAvatar, // Gán avatar mới
              avatarUrl: newAvatar // Hoặc gán vào avatarUrl tùy theo logic của bạn
            } as UserProfile; // Ép kiểu là UserProfile
          }
          
          // Nếu prev đã tồn tại, thực hiện spread an toàn
          return { ...prev, avatar: newAvatar };
        });
      };
      
      reader.readAsDataURL(file);
    }
};
  //handle submit and send to backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Profile updated:", profile);

    // alert('Profile updated successfully!');
  };
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    // send change password API request to backend
    console.log("Password change submitted for user:", profile?.email);
    console.log({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    alert("Password updated successfully!");
    // Clear password fields after submission
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
  
      <NavBarUser></NavBarUser>
      <div
        className="min-h-screen bg-gray-50 text-gray-800"
        style={{
          backgroundImage: `
        linear-gradient(135deg, 
          rgba(248,250,252,1) 0%, 
          rgba(219,234,254,0.7) 30%, 
          rgba(165,180,252,0.5) 60%, 
          rgba(129,140,248,0.6) 100%
        ),
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(199,210,254,0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(224,231,255,0.3) 0%, transparent 60%)
      `,
        }}
      >
        <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tighter">
            Profile{" "}
            <span className="bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
              Settings
            </span>
          </h1>

          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Left Sidebar Navigation */}
            <aside className="md:w-1/4 mb-8 md:mb-0">
              <ul className="space-y-2">
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

            {/* Right Content Area */}
            <main className="flex-1">
              <div className="rounded-xl bg-white p-6 sm:p-8 shadow-md">
                {activeTab === "edit-profile" && (
                  <EditProfileForm
                    profile={profile}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                    onSubmit={handleSubmit}
                  />
                )}
                {activeTab === "security" && (
                  <SecurityTab
                    passwords={passwords}
                    onPasswordChange={handlePasswordChange}
                    onPasswordSubmit={handlePasswordSubmit}
                  />
                )}
                {activeTab === "notifications" && <NotificationsTab />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}



// --- SidebarLink Component ---
interface SidebarLinkProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarLink: FC<SidebarLinkProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center space-x-3 rounded-lg px-4 py-3 font-medium transition-colors duration-200 ${
        isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon icon={icon} className="w-5 text-center" />
      <span>{label}</span>
    </button>
  </li>
);

// --- EditProfileForm Component ---
interface EditProfileFormProps {
  profile: UserProfile | null;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const EditProfileForm: FC<EditProfileFormProps> = ({
  profile,
  onInputChange,
  onFileChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-8">
    <div>
      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
      <p className="mt-1 text-sm text-gray-500">
        Update your photo and personal details here.
      </p>
    </div>

    {/* Profile Picture Section */}
    <div className="flex items-center space-x-6 border-t pt-6">
      <Image
        src={profile?.avatar || '/assets/avatar-landing-page.jpg' }
        alt="Profile"
        className="h-20 w-20 rounded-full object-cover"
        width={100}
        height={100}
      />
      <div>
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Change Photo
        </label>
        <input
          id="avatar-upload"
          name="avatar-upload"
          type="file"
          className="sr-only"
          onChange={onFileChange}
          accept="image/*"
        />
        <p className="mt-2 text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
      </div>
    </div>

    {/* Form Fields */}
    <div className="space-y-6 border-t pt-6">
      <InputField
        label="Full Name"
        name="name"
        value={profile?.fullName || 'Default User'}
        onChange={onInputChange}
      />
      <InputField
        label="Email Address"
        name="email"
        type="email"
        value={profile?.email || 'example@mail.com'}
        onChange={onInputChange}
        disabled
      />
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Your Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={profile?.bio}
          onChange={onInputChange}
        ></textarea>
        <p className="mt-2 text-sm text-gray-500">
          Write a few sentences about yourself.
        </p>
      </div>
    </div>


    {/* Action Buttons */}
    <div className="flex justify-end space-x-4 border-t pt-6">
      <Button
        type="button"
        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        
      >
        Save Changes
      </Button>
    </div>
  </form>
);

// --- InputField Component ---
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const InputField: FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 sm:text-sm"
    />
  </div>
);

interface SecurityTabProps {
  passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
// --- Placeholder Components for Other Tabs ---
const SecurityTab: FC<SecurityTabProps> = ({
  passwords,
  onPasswordChange,
  onPasswordSubmit,
}) => (
  <div>
    <h2 className="text-xl font-bold text-gray-900">Password & Security</h2>
    <p className="mt-1 text-sm text-gray-500">
      Update your password and secure your account.
    </p>
    <div className="space-y-6 border-t pt-6 mt-6">
      <InputField
        label="Current Password"
        name="currentPassword"
        type="password"
        value={passwords.currentPassword}
        onChange={onPasswordChange}
      />
      <InputField
        label="New Password"
        name="newPassword"
        type="password"
        value={passwords.newPassword}
        onChange={onPasswordChange}
      />
      <InputField
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={passwords.confirmPassword}
        onChange={onPasswordChange}
      />
    </div>
    <div className="flex justify-end space-x-4 border-t pt-6 mt-6">
      <Button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
      >
        Update Password
      </Button>
    </div>
  </div>
);

const NotificationsTab = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
    <p className="mt-1 text-sm text-gray-500">
      Manage how you receive notifications.
    </p>
    <div className="space-y-6 border-t pt-6 mt-6">
      <p className="text-gray-600">
        Notification settings will be available soon.
      </p>
    </div>
  </div>
);
