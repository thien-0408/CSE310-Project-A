"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2, User, Mail, Lock, AtSign, Github, Check } from "lucide-react";

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

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const formSchema = z
    .object({
      fullName: z.string().min(2, "Full name is required"),
      email: z.string().email("Invalid email address"),
      username: z.string().min(2, "Username must be at least 2 characters"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(6),
      terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setApiError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5151";

    try {
      const response = await fetch(`${apiUrl}/api/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          fullName: values.fullName,
          email: values.email,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setApiError(errorMessage || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const userProfile = await response.json();
      console.log("Registration successful:", userProfile);
      router.push("/login?registered=true");

    } catch (error) {
      console.error("Registration failed:", error);
      setApiError("Failed to connect to the server. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* --- LEFT SIDE: Branding (Hidden on mobile) --- */}
      <div data-aos = "fade-down" data-aos-duration = "500" className="hidden bg-slate-900 lg:block relative overflow-hidden">
         {/* Background Effect */}
         <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-900 to-slate-900 opacity-90" />

         <div className="relative z-20 flex h-full flex-col justify-between p-12 text-white">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={30}
                height={30}
                className="brightness-0 invert"
              />
              <span>IELTSSprint Inc.</span>
            </div>
            
            <div className="space-y-4 max-w-lg">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter">
                &quot;Join the community of achievers.&quot;
              </h1>
              <p className="text-blue-200 text-lg">
                Create an account today to access personalized study plans, mock tests, and AI-driven analytics.
              </p>
              
              {/* Feature List (Optional visual filler) */}
              <div className="mt-8 space-y-3">
                {['Unlimited Practice Tests', 'AI Speaking Analysis', 'Vocabulary Builder'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-blue-100">
                    <Check className="h-4 w-4 text-green-400" /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-200">
              <p>&copy; 2025 IELTSSprint. All rights reserved.</p>
            </div>
         </div>
      </div>

      {/* --- RIGHT SIDE: Registration Form --- */}
      <div data-aos = "fade-down" data-aos-duration = "500" className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="mx-auto grid w-full max-w-[450px] gap-6">
          
          {/* Header */}
          <div className="flex flex-col space-y-2 text-center">
            <div className="lg:hidden flex justify-center mb-4">
               <Image src="/assets/logo.png" alt="Logo" width={48} height={48} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground text-gray-500">
              Enter your information below to get started
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Full Name & Username Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="John Doe" {...field} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="johndoe" {...field} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="name@example.com" {...field} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password & Confirm Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input type="password" placeholder="••••••" {...field} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input type="password" placeholder="••••••" {...field} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the <Link href="/terms" className="text-blue-600 hover:underline">terms and conditions</Link>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Error Message */}
              {apiError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 text-center">
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
                Sign Up
              </Button>
            </form>
          </Form>
          
           {/* Social Divider */}
           <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or register with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="h-11 bg-white border-gray-200 hover:bg-gray-50">
               <Github className="mr-2 h-4 w-4" /> Github
             </Button>
             <Button variant="outline" className="h-11 bg-white border-gray-200 hover:bg-gray-50">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
             </Button>
          </div>

          <p className="px-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}