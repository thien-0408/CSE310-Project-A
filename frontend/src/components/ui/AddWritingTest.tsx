"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastNotification";
import { 
  PenTool, 
  Clock, 
  Type, 
  Image as ImageIcon, 
  Save, 
  Loader2,
  FileText,
  AlignLeft
} from "lucide-react";
import Image from "next/image";

export default function CreateWritingTest() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- Form State ---
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "", 
    topic: "",    
    duration: 60,
    testType: "Task 1", 
    skill: "writing",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Tạo URL preview
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Prepare FormData
      const data = new FormData();
      data.append("Title", formData.title);
      data.append("Subtitle", formData.subtitle);
      data.append("Topic", formData.topic);
      // [FIXED] Đảm bảo duration là số nguyên
      data.append("Duration", parseInt(formData.duration.toString()).toString());
      data.append("TestType", formData.testType);
      data.append("Skill", formData.skill);

      if (imageFile) {
        data.append("Image", imageFile);
      }

      // 2. Get Token
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("You must be logged in as Admin", "error")
        setIsLoading(false);
        return;
      }

    
      const apiUrl = "http://localhost:5151/api/writing-test/add"; 
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(errorText || "Failed to create writing test");
      }

      const result = await response.json();
      showToast(`Writing Test Created Successfully! ID: ${result.id}`, "success")
      
      
      // router.push("/admin/writing"); 
      
    } catch (error: unknown) {
      console.error(error);
      showToast("Some errors occured", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 mt-5">
      <div className=" mx-auto">
        <ToastComponent></ToastComponent>
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <PenTool className="text-purple-600" /> Create Writing Test
            </h1>
            <p className="text-sm text-gray-500 mt-1">Add a new IELTS Writing Task 1 or Task 2.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-700 border-b pb-3 mb-4 flex items-center gap-2">
              <FileText size={18} /> General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                <input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. The Charts below show the percentage..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Subtitle / Instruction */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Prompt Question</label>
                <input
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Summarise the information by selecting and reporting the main features..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <div className="relative">
                  <Type className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select
                    name="testType"
                    value={formData.testType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 p-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                  >
                    <option value="Task 1">IELTS Writing Task 1</option>
                    <option value="Task 2">IELTS Writing Task 2</option>
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Topic & Content Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-700 border-b pb-3 mb-4 flex items-center gap-2">
              <AlignLeft size={18} /> Topic Content
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Question Description</label>
                <textarea
                  name="topic"
                  required
                  rows={6}
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="Enter the full topic text here..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none resize-y"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Image (Chart/Graph)</label>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>

                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                      <Image src={previewUrl} alt="Preview" width={200} height={200} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {isLoading ? "Creating..." : "Create Writing Test"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}