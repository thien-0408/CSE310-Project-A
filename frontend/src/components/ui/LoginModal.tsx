"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // 1. Import jwt-decode

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 2. Define the structure for the decoded token
interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  role?: string | string[];
  sub?: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); 
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Animation control
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setApiError(null); 
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

    try {
      const response = await fetch(`${apiUrl}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setApiError(errorMessage || "Invalid username or password");
        setIsLoading(false);
        return;
      }

      // Successfully login and get token
      const tokens = await response.json(); 

      // Save token into local storage
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      console.log("Login successful! Tokens received:", tokens);

      // 3. Decode Token and Route based on Role
      try {
        const decoded: DecodedToken = jwtDecode(tokens.accessToken);
        
        // Extract role (handling ASP.NET Identity URL and potential Array vs String)
        const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
        const userRole = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

        // Close modal logic (optional, but good for cleanup)
        setIsAnimating(false);

        if (userRole === "Admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        
        // Trigger onClose after navigation starts (optional)
        onClose();

      } catch (decodeError) {
        console.error("Token decoding failed:", decodeError);
        // Fallback to dashboard if decoding fails
        router.push("/dashboard");
        onClose();
      }

    } catch (error) {
      // Handle internet error
      console.error("Login failed:", error);
      setApiError("Failed to connect to the server. Please try again.");
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      {/* Backdrop with fade-in animation */}
      <div 
        className={`absolute inset-0 bg-black backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Content with scale + fade animation */}
      <div 
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-300 ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-2xl relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header Section with Logo and Title */}
              <div className="flex items-center justify-center mb-3">
                <Image
                  src="/assets/logo.png"
                  alt="IELTSSprint Logo"
                  width={50}
                  height={50}
                  quality={100}
                  className="mr-3"
                />
                <h1 className="text-4xl font-extrabold italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
                  IELTSSprint
                </h1>
              </div>

              {/* Sign In Title and Subtitle */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-600 text-sm">
                  Welcome back! Please enter your details to sign in.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Email or Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                        Email or Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••"
                          type="password"
                          {...field} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="rememberMe" />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>

                {apiError && (
                  <p className="text-sm font-medium text-red-600">
                      {apiError}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit" disabled={isLoading} 

                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                  </span>
                  <a
                    href="/register"
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}