"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 1. Import router
import { useState } from "react"; // 2. Import useState

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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const router = useRouter(); // 3. Khởi tạo router
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 4. SỬA LẠI HOÀN CHỈNH SCHEMA ĐỂ KHỚP VỚI FORM
  // Backend RegisterDto.cs của bạn cần: UserName, Password, FullName, Email
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
      path: ["confirmPassword"], // Gắn lỗi vào trường confirmPassword
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // 5. Cập nhật defaultValues
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // 6. SỬA HÀM onSubmit ĐỂ GỌI API
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
        // Payload này khớp với RegisterDto.cs của bạn
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          fullName: values.fullName,
          email: values.email,
        }),
      });

      if (!response.ok) {
        // Xử lý lỗi (ví dụ: "User Already Exist!")
        const errorMessage = await response.text();
        setApiError(errorMessage || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Đăng ký thành công!
      // Backend của bạn trả về UserProfileDto (đã sửa ở bước trước)
      const userProfile = await response.json();
      console.log("Registration successful:", userProfile);

      // Chuyển hướng người dùng đến trang Login
      router.push("/login?registered=true"); // Thêm param để hiển thị thông báo "Đăng ký thành công!"
      
    } catch (error) {
      console.error("Registration failed:", error);
      setApiError("Failed to connect to the server. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen "
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
          {/* 7. BỎ FormField bọc ngoài đi. 
              Thay vào đó, chỉ dùng FormItem làm thẻ div bọc.
              Chúng ta sẽ bọc TỪNG Input bằng FormField
          */}
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
              <p className="text-gray-600 text-sm">towards IELTS success</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mt-6">
              {/* 8. BỌC TỪNG TRƯỜNG BẰNG FormField */}

              {/* Full Name Field */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="kudoskibidi@gmail.com"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 9. THÊM TRƯỜNG USERNAME VÌ BACKEND CẦN */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="kudo_skibidi"
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

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-900 mb-2">
                      Confirm Password
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

              {/* Terms and conditions */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="terms">
                        I accept the terms and condition
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 10. HIỂN THỊ LỖI API */}
              {apiError && (
                <p className="text-sm font-medium text-red-600">
                  {apiError}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading} // 11. Vô hiệu hóa khi tải
                className="w-full bg-blue-400 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-sm text-gray-900">
                  Already have an account?{" "}
                </span>
                <a
                  href="/login"
                  className="text-sm text-blue-500 hover:text-blue-500 font-medium"
                >
                  Sign In
                </a>
              </div>
            </div>
          </FormItem>
        </form>
      </Form>
    </div>
  );
}