"use client";
import { jwtDecode } from "jwt-decode";
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
import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, Github } from "lucide-react"; // Import Icons

// Define the interface for the decoded token
interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
    | string
    | string[];
  role?: string | string[];
  sub?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

      const tokens = await response.json();

      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      try {
        const decoded: DecodedToken = jwtDecode(tokens.accessToken);
        const roleClaim =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || decoded.role;
        const userRole = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

        if (userRole === "Admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } catch (decodeError) {
        console.error("Token decoding failed:", decodeError);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setApiError("Failed to connect to the server. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left side*/}
      <div
        data-aos="fade-down"
        data-aos-duration="500"
        className="hidden bg-slate-900 lg:block relative overflow-hidden"
      >
        {/* Abstract Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-900 to-slate-900 opacity-90" />

        {/* Content Overlay */}
        <div className="relative z-20 flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={30}
              height={30}
              className="brightness-0 invert" // make logo white
            />
            <span>IELTSSprint Inc.</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter">
              &quot;Mastering IELTS <br /> has never been easier.&quot;
            </h1>
            <p className="text-blue-200 text-lg">
              Join thousands of students achieving their dream scores with our
              platform.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <p>&copy; 2025 IELTSSprint. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right side*/}
      <div
        data-aos="fade-down"
        data-aos-duration="500"
        className="flex items-center justify-center py-12 px-4 sm:px-6 bg-white"
      >
        <div className="mx-auto grid w-full max-w-[450px] gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="lg:hidden flex justify-center mb-4">
              <Image src="/assets/logo.png" alt="Logo" width={48} height={48} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm  text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="skibidi"
                          {...field}
                          className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field with Icon */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {apiError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 flex items-center justify-center">
                  {apiError}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md transition-all"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          {/* Social Login Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500"></span>
            </div>
          </div>

          {/* Social Buttons (Visual Only) */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 bg-white border-gray-200 hover:bg-gray-50"
            >
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
            <Button
              variant="outline"
              className="h-11 bg-white border-gray-200 hover:bg-gray-50"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
