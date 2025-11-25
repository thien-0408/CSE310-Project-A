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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";

// Define the interface for the decoded token
interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
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

      //Decode token to get user role
      try {
        const decoded: DecodedToken = jwtDecode(tokens.accessToken);
        
        const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
        const userRole = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

        console.log(userRole);

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
    <>
      <div
        className="flex justify-center items-center min-h-screen"
        style={{
          backgroundImage: `
           radial-gradient(circle at center, #93c5fd, transparent)
         `,
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="bg-white border-2 border-gray-200 rounded-2xl p-11 shadow-sm">
                  {/* ... Logo header ... */}
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

                  {/* ... Sign in title ... */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Sign In
                    </h2>
                    <p className="text-gray-900 text-sm">
                      Welcome back! Please enter your details to sign in.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Username Field */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <div>
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
                        </div>
                      )}
                    />
                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <div>
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
                        </div>
                      )}
                    />

                    {/* ... Remember me ... */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="rememberMe" />
                        <Label htmlFor="rememberMe">Remember me</Label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-600 font-medium"
                      >
                        Forgot your password?
                      </Link>
                    </div>

                    {/* --- Display API error --- */}
                    {apiError && (
                      <p className="text-sm font-medium text-red-600">
                        {apiError}
                      </p>
                    )}

                    {/* --- Disable button when submiting--- */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-400 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>

                    {/* ... Sign up link ... */}
                    <div className="text-center">
                      <span className="text-sm text-gray-900">
                        Dont have an account?{" "}
                      </span>
                      <Link
                        href="/register"
                        className="text-sm text-blue-500 hover:text-blue-500 font-medium"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </>
  );
}