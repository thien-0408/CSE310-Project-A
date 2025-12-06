"use client";

import React, { useState } from "react";
import { Plus, Lightbulb, BookOpen, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/ToastNotification";

// --- Interfaces ---
interface DailyWordData {
  word: string;
  phonetic: string;
  type: string;
  definition: string;
  example: string;
}

interface DailyTipData {
  title: string;
  category: string;
  content: string;
}

export default function AdminDailyManager() {
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const [isWordOpen, setIsWordOpen] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [wordData, setWordData] = useState<DailyWordData>({
    word: "",
    phonetic: "",
    type: "noun",
    definition: "",
    example: "",
  });

  const [tipData, setTipData] = useState<DailyTipData>({
    title: "",
    category: "Grammar",
    content: "",
  });

  // --- API URL ---
  const API_BASE_URL = "http://localhost:5151/api/admin";

  // --- Handlers ---
  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // 1. API Add Daily Word
  const handleAddWord = async () => {
    if (!wordData.word || !wordData.definition)
      return showToast("Please fill required fields", "warning");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/add-daily-word`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(wordData),
      });

      if (response.ok) {
        showToast("Daily Word Updated Successfully!", "success");
        setIsWordOpen(false);
        // Reset form (optional)
        setWordData({
          word: "",
          phonetic: "",
          type: "noun",
          definition: "",
          example: "",
        });
      } else {
        const errorText = await response.text();
        showToast(`Failed ${errorText}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast(`Network error`, "error");
    } finally {
      setLoading(false);
    }
  };

  // 2. API Add Daily Tip
  const handleAddTip = async () => {
    if (!tipData.title || !tipData.content)
      return showToast("Please fill required fields", "warning");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/add-daily-tip`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(tipData),
      });

      if (response.ok) {
        showToast("Daily Tip Updated Successfully!", "success");
        setIsTipOpen(false);
        setTipData({ title: "", category: "Grammar", content: "" });
      } else {
        const errorText = await response.text();
        showToast(`Failed ${errorText}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast(`Network error`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4  rounded-xl">
      {/* --- BUTTON 1: ADD WORD --- */}
      <ToastComponent></ToastComponent>
      <Dialog open={isWordOpen} onOpenChange={setIsWordOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-12 text-base">
            <BookOpen className="w-5 h-5" /> Update Daily Word
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Word of the Day</DialogTitle>
            <DialogDescription>
              This will update the single daily word record in the database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Word</label>
                <input
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g. Ephemeral"
                  value={wordData.word}
                  onChange={(e) =>
                    setWordData({ ...wordData, word: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phonetic</label>
                <input
                  className="w-full p-2 border rounded-md"
                  placeholder="/ɪˈfem.ər.əl/"
                  value={wordData.phonetic}
                  onChange={(e) =>
                    setWordData({ ...wordData, phonetic: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full p-2 border rounded-md bg-white"
                value={wordData.type}
                onChange={(e) =>
                  setWordData({ ...wordData, type: e.target.value })
                }
              >
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="idiom">Idiom</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Definition</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={2}
                placeholder="Meaning of the word..."
                value={wordData.definition}
                onChange={(e) =>
                  setWordData({ ...wordData, definition: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Example Sentence</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={2}
                placeholder="Example usage..."
                value={wordData.example}
                onChange={(e) =>
                  setWordData({ ...wordData, example: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWordOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddWord}
              disabled={loading}
              className="bg-indigo-600"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Word
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- BUTTON 2: ADD TIP --- */}
      <Dialog open={isTipOpen} onOpenChange={setIsTipOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white gap-2 h-12 text-base">
            <Lightbulb className="w-5 h-5" /> Update Daily Tip
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Daily Tip</DialogTitle>
            <DialogDescription>
              Update the tip shown on the user dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                className="w-full p-2 border rounded-md"
                placeholder="e.g. Passive Voice"
                value={tipData.title}
                onChange={(e) =>
                  setTipData({ ...tipData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full p-2 border rounded-md bg-white"
                value={tipData.category}
                onChange={(e) =>
                  setTipData({ ...tipData, category: e.target.value })
                }
              >
                <option value="Grammar">Grammar</option>
                <option value="Vocabulary">Vocabulary</option>
                <option value="Exam Tip">Exam Tip</option>
                <option value="Motivation">Motivation</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Tip content details..."
                value={tipData.content}
                onChange={(e) =>
                  setTipData({ ...tipData, content: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTipOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTip}
              disabled={loading}
              className="bg-orange-600"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Tip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
