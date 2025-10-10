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

export default function LoginPage() {
  const router = useRouter();
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
  const userInfo = {
    username: "admin",
    password: "admin123",
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.username !== userInfo.username) {
      form.setError("username", { message: "User not found" });
      return;
    }
    if (values.password !== userInfo.password) {
      form.setError("password", { message: "Incorrect password" });
      return;
    }
    console.log("Login successful! Redirecting with data:", values);
    router.push("/dashboard");
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen  "  style={{
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
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Sign In
                    </h2>
                    <p className="text-gray-900 text-sm">
                      Welcome back! Please enter your details to sign in.
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Email or Username Field */}
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

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="rememberMe" />
                        <Label htmlFor="rememberMe">Remember me</Label>
                      </div>
                      <a
                        href="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-600 font-medium"
                      >
                        Forgot your password?
                      </a>
                    </div>

                    {/* Error Message */}
                    <FormMessage className="text-red-600 text-sm" />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-400 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Sign In
                    </Button>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <span className="text-sm text-gray-900">
                        Dont have an account?{" "}
                      </span>
                      <a
                        href="/register"
                        className="text-sm text-blue-500 hover:text-blue-500 font-medium"
                      >
                        Sign Up
                      </a>
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
