"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
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
  const [profile, setProfile] = useState<UserProfile | null>(null);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";
  //CSS for nav bar 
  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    
    const baseClasses = "font-medium px-4 py-3 rounded-full transition-all duration-300";
      if (isActive) {
      return `${baseClasses} text-white bg-gradient-to-r from-[#00c6ff] to-[#0072ff] bg-blue-100 shadow-sm font-bold`;
    }
      return `${baseClasses} hover:text-white hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:bg-blue-100`;
  };

  const handleLogout = async () =>{
    const token = localStorage.getItem("accessToken");
    if(token){
      try{
        await fetch (`${apiUrl}/api/Auth/logout`,{
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }catch (error){
        console.error("There're something wrong");
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href= "/"
  }
  const handleProfile = () =>{
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

    
  
    return (
    <header className="w-full  bg-white shadow-sm border-b">
      <div className=" mx-auto px-4 py-2 container">
        <div className="flex items-center justify-between">
          {/* Left Side: Logo + Navigation */}
          
            {/* Logo and Brand */}
             <div className="flex items-center shrink-0">
            <Link href={'/'} className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="IELTS Sprint Logo"
                width={32} 
                height={32}
                quality={100}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent hidden sm:block">
                IELTS Sprint
              </h1>
            </Link>
          </div>
            

            {/* Navigation Menu - flows naturally from logo */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu className=" p-3 px-12 shadow-lg rounded-full"> 
              <NavigationMenuList className="flex items-center space-x-1">
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/" 
                      className={getLinkClassName('/dashboard')}
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/reading" 
                      className={getLinkClassName('/practice')}
                    >
                      Practice
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/listening" 
                      className={getLinkClassName('/view-tests')}
                    >
                      Tests
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/profile" 
                      className={getLinkClassName('/profile')}
                    >
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>
          

          {/* Right Side: avatar */}
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all">
                  <AvatarImage src={apiUrl + profile?.avatarUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    ISP
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <CgProfile />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MdOutlineAttachMoney />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HiUserGroup />
                  Team
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} >
                    <IoLogOut/>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
