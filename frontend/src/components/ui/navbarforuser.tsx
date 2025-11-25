"use client";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { UserProfile } from "@/types/userProfile";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 

export default function NavBarUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    
    if (isActive) {
      return "relative font-semibold px-6 py-2.5 text-blue-600 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-600 after:to-cyan-400 after:rounded-full";
    }
    
    return "relative font-medium px-6 py-2.5 text-gray-600 hover:text-blue-600 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-600 after:to-cyan-400 after:rounded-full after:transition-all after:duration-300";
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");
    if(token){
      try{
        await fetch(`${apiUrl}/api/Auth/logout`,{
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }catch (error){
        console.error("There're something wrong", error);
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/"
  }

  const handleProfile = () => {
    router.push("/profile")
  }

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

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
         
          {/* Logo & Brand */}
          <div className="flex items-center shrink-0">
            
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
                <li>
                  <Link href={'#'} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur-sm opacity-0 hover:opacity-70 transition-opacity duration-300"></div>
                <Image
                  src="/assets/logo.png"
                  alt="IELTS Sprint Logo"
                  width={40}
                  height={40}
                  quality={100}
                  className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
                </li>
              <li>
                <Link href="/dashboard" className={getLinkClassName('/dashboard')}>
                  Dashboard
                </Link>
              </li>

              <li>
                <Link href="/practice" className={getLinkClassName('/practice')}>
                  Practice
                </Link>
              </li>

              <li>
                <Link href="/tests" className={getLinkClassName('/tests')}>
                  Tests
                </Link>
              </li>

              <li>
                <Link href="/profile" className={getLinkClassName('/profile')}>
                  Profile
                </Link>
              </li>

            </ul>
          </nav>

          {/* Avatar Dropdown */}
          <div className="flex items-center shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-300 border-2 border-transparent hover:border-blue-100">
                  <AvatarImage src={apiUrl + profile?.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-semibold">
                    {profile?.fullName?.charAt(0).toUpperCase() || 'ISP'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-semibold text-gray-700">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleProfile}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <CgProfile className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 transition-colors">
                  <MdOutlineAttachMoney className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 transition-colors">
                  <HiUserGroup className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors"
                >
                  <IoLogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </div>
    </header>
  );
}