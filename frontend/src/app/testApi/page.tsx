"use client";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/userProfile";


const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";


export async function getUserProfile(token: string): Promise<UserProfile | null> {
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
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error(`Lỗi ${response.status} khi lấy profile:`, errorBody);
      return null;
    }
    const data: UserProfile = await response.json();
    console.log(data);
    
    return data;

  } catch (error) {
    console.error("API connection error:", error);
    return null;
  }
}
function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken'); 
  }
  return null;
}
export default function TestPage(){
const [profile, setProfile] = useState<UserProfile | null>(null);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    // **Logic gọi API nằm trọn trong useEffect**
    async function loadUserProfileData() {
      const token = getStoredToken(); 
      setLoading(true); // Bắt đầu tải

      if (!token) {
        console.warn("Can't find token");
        setError(true);
        setLoading(false);
        return;
      }
      
      console.log("Loading...");

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
  if (loading) {
    return <h1>Loading</h1>;
  }

  if (error || !profile) {
    return <h1>Can&apos;t get profile or invalid token</h1>;
  }
    return (
       <div>
      <p>**{profile.fullName}**</p>
      <p> **{profile.role}**</p>
      <p>Full name : {profile.fullName}</p>
      <p>Date of birth : {profile.dateOfBirth}</p>
      <p>image: {apiUrl}{profile.avatarUrl}</p>
      <img src={apiUrl + profile.avatarUrl} alt=""/>
    </div>
    )
}