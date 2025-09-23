"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8]">
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-md"
    >
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="bg-white border-2 border-gray-200 rounded-2xl px-9 py-7 shadow-sm">
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
              
            </div>
            
            {/* Sign In Title and Subtitle */}
            <div className="text-center ">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-900 text-sm">
                Join IELTS Sprint today and start your journey
              </p>
              <p className="text-gray-600 text-sm">
                towards IELTS success
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Register information */}
              <div>
                <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Kudo Skibidi" 
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </FormControl>
              </div>

              <div>
                <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="kudoskibidi@gmail.com" 
                    
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </FormControl>
              </div>
              {/*Pass and confirm pass */}
              <div>
                <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••" 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </FormControl>
              </div>
              <div>
                <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••" 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </FormControl>
              </div>

              {/* term and conditions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id='terms'/>
                  <Label htmlFor="terms">I accept the terms and condition</Label>
                </div>
              </div>

              {/* Error Message */}
              <FormMessage className="text-red-600 text-sm" />

              {/* Submit Button */}
              <Button 
                type="submit"
                className="w-full bg-blue-400 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-sm text-gray-900">Already have an account? </span>
                <a 
                  href="/login" 
                  className="text-sm text-blue-500 hover:text-blue-500 font-medium"
                >
                  Sign In
                </a>
              </div>
            </div>
          </FormItem>
        )}
      />
    </form>
  </Form>
</div>

  );
}
