"use client";

import React, { useState, ChangeEvent } from "react";
import { Plus, Trash2, Save, Upload, GripVertical, ChevronDown, ChevronRight, FileAudio, Image as ImageIcon } from "lucide-react";

type QuestionOption = { key: string; text: string; };
type Answer = { answerText: string; };

type Question = {
  questionNumber: number;
  questionText: string;
  isInput: boolean;
  wordLimit?: string;
  answers: Answer[];
  questionOptions: QuestionOption[]; //For Multiple Choice
};

type Section = {
  sectionNumber: number;
  sectionTitle: string;
  sectionRange: string; // e.g., "Questions 1-5"
  questionType: string; // "multiple_choice", "map_labeling", "form_completion"
  instructions: string;
  mapImageUrl?: string; // url
  questions: Question[];
};

type Part = {
  partNumber: number;
  partTitle: string;
  context: string;
  questionRange: string;
  sections: Section[];
};

// --- MAIN COMPONENT ---
export default function CreateListeningTest() {
  // --- STATE: Metadata ---
  const [title, setTitle] = useState("New IELTS Listening Test");
  const [testType, setTestType] = useState("full_test");
  const [audioDuration, setAudioDuration] = useState(30);
  
  // --- STATE: Files ---
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- STATE: Structure (Parts -> Sections -> Questions) ---
  const [parts, setParts] = useState<Part[]>([
    { partNumber: 1, partTitle: "Conversation", context: "", questionRange: "1-10", sections: [] }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // --- ACTIONS: PART ---
  const addPart = () => {
    setParts([...parts, {
      partNumber: parts.length + 1,
      partTitle: "",
      context: "",
      questionRange: "",
      sections: []
    }]);
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const updatePart = (index: number, field: keyof Part, value: unknown) => {
    const newParts = [...parts];
    newParts[index] = { ...newParts[index], [field]: value };
    setParts(newParts);
  };

  // --- ACTIONS: SECTION ---
  const addSection = (partIndex: number) => {
    const newParts = [...parts];
    newParts[partIndex].sections.push({
      sectionNumber: newParts[partIndex].sections.length + 1,
      sectionTitle: "",
      sectionRange: "",
      questionType: "form_completion", 
      instructions: "Write NO MORE THAN TWO WORDS",
      questions: []
    });
    setParts(newParts);
  };

  const removeSection = (partIndex: number, sectionIndex: number) => {
    const newParts = [...parts];
    newParts[partIndex].sections = newParts[partIndex].sections.filter((_, i) => i !== sectionIndex);
    setParts(newParts);
  };

  const updateSection = (pIdx: number, sIdx: number, field: keyof Section, value: unknown) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx] = { ...newParts[pIdx].sections[sIdx], [field]: value };
    setParts(newParts);
  };

  // --- ACTIONS: QUESTION ---
  const addQuestion = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    const currentQ = newParts[pIdx].sections[sIdx].questions;
    const lastQNum = currentQ.length > 0 ? currentQ[currentQ.length - 1].questionNumber : 0;
    
    currentQ.push({
      questionNumber: lastQNum + 1,
      questionText: "",
      isInput: true,
      answers: [{ answerText: "" }],
      questionOptions: []
    });
    setParts(newParts);
  };

  const updateQuestion = (pIdx: number, sIdx: number, qIdx: number, field: keyof Question, value: unknown) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions[qIdx] = { ...newParts[pIdx].sections[sIdx].questions[qIdx], [field]: value };
    setParts(newParts);
  };

  const updateAnswer = (pIdx: number, sIdx: number, qIdx: number, val: string) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions[qIdx].answers[0].answerText = val;
    setParts(newParts);
  };

  // --- API SUBMIT ---
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("TestType", testType);
      formData.append("Skill", "listening");
      formData.append("AudioDuration", audioDuration.toString());
      
      // Convert object to json
      formData.append("Parts", JSON.stringify(parts));

      if (audioFile) formData.append("Audio", audioFile);
      if (imageFile) formData.append("Image", imageFile);

      // Gọi API
      const token = localStorage.getItem("accessToken"); 
      const res = await fetch("http://localhost:5151/api/listening-test/add-listening-test", {
        method: "POST",
        body: formData, 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Lỗi: " + (err.message || "Can't create test"));
      } else {
        alert("Test added");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER & METADATA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Create Listening Test</h1>
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
            >
              <Save size={20} /> {isLoading ? "Saving..." : "Save Test"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Cambridge 18 Test 1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={testType} onChange={e => setTestType(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5">
                      <option value="full_test">Full Test</option>
                      <option value="part_test">Part Test</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                    <input type="number" value={audioDuration} onChange={e => setAudioDuration(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg p-2.5" />
                 </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileAudio size={16} className="text-indigo-600"/> Main Audio File
                </label>
                <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon size={16} className="text-indigo-600"/> Cover Image
                </label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              </div>
            </div>
          </div>
        </div>

        {/* PARTS BUILDER LOOP */}
        <div className="space-y-6">
          {parts.map((part, pIdx) => (
            <div key={pIdx} className="bg-white rounded-xl shadow-sm border border-l-4 border-l-blue-500 overflow-hidden">
              {/* Part Header */}
              <div className="bg-gray-50 p-4 border-b flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-700 whitespace-nowrap">PART {part.partNumber}</span>
                      <input 
                        className="w-full border-b border-transparent hover:border-blue-300 bg-transparent focus:border-blue-500 outline-none font-medium px-2"
                        placeholder="Part Title..." 
                        value={part.partTitle} 
                        onChange={e => updatePart(pIdx, "partTitle", e.target.value)} 
                      />
                   </div>
                   <input 
                      className="border-b border-transparent hover:border-blue-300 bg-transparent focus:border-blue-500 outline-none text-sm px-2"
                      placeholder="Context (e.g. A conversation about...)" 
                      value={part.context} 
                      onChange={e => updatePart(pIdx, "context", e.target.value)} 
                   />
                   <input 
                      className="border-b border-transparent hover:border-blue-300 bg-transparent focus:border-blue-500 outline-none text-sm px-2"
                      placeholder="Question Range (e.g. 1-10)" 
                      value={part.questionRange} 
                      onChange={e => updatePart(pIdx, "questionRange", e.target.value)} 
                   />
                </div>
                <button onClick={() => removePart(pIdx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={18} /></button>
              </div>

              {/* Sections List */}
              <div className="p-4 bg-white space-y-6">
                {part.sections.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm italic">No sections yet. Add one to start adding questions.</div>
                )}
                
                {part.sections.map((section, sIdx) => (
                  <div key={sIdx} className="border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition bg-slate-50">
                    <button onClick={() => removeSection(pIdx, sIdx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    
                    {/* Section Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                       <div>
                          <label className="text-xs text-gray-500 font-semibold uppercase">Question Type</label>
                          <select 
                            className="w-full border border-gray-300 rounded p-1.5 text-sm font-medium text-blue-800"
                            value={section.questionType}
                            onChange={e => updateSection(pIdx, sIdx, "questionType", e.target.value)}
                          >
                             <option value="form_completion">Form Completion</option>
                             <option value="multiple_choice">Multiple Choice</option>
                             <option value="map_labeling">Map Labeling</option>
                             <option value="diagram_labeling">Diagram Labeling</option>
                             <option value="matching">Matching Info</option>
                             <option value="short_answer">Short Answer</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-xs text-gray-500 font-semibold uppercase">Section Range</label>
                          <input className="w-full border border-gray-300 rounded p-1.5 text-sm" placeholder="Questions 1-5" value={section.sectionRange} onChange={e => updateSection(pIdx, sIdx, "sectionRange", e.target.value)}/>
                       </div>
                       <div className="lg:col-span-2">
                          <label className="text-xs text-gray-500 font-semibold uppercase">Instructions</label>
                          <input className="w-full border border-gray-300 rounded p-1.5 text-sm" placeholder="No more than two words..." value={section.instructions} onChange={e => updateSection(pIdx, sIdx, "instructions", e.target.value)}/>
                       </div>
                    </div>

                    {/* Conditional Input: Map Image URL */}
                    {(section.questionType === 'map_labeling' || section.questionType === 'diagram_labeling') && (
                       <div className="mb-4 bg-blue-50 p-3 rounded border border-blue-100 flex items-center gap-3">
                          <ImageIcon size={18} className="text-blue-500"/>
                          <input 
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm" 
                            placeholder="Paste Map/Diagram Image URL here..." 
                            value={section.mapImageUrl || ""}
                            onChange={e => updateSection(pIdx, sIdx, "mapImageUrl", e.target.value)}
                          />
                       </div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-3 pl-4 border-l-2 border-gray-300">
                       {section.questions.map((q, qIdx) => (
                          <div key={qIdx} className="flex gap-3 items-start group">
                             <div className="mt-2 text-xs font-bold text-gray-500 w-6 text-center bg-gray-200 rounded py-1">{q.questionNumber}</div>
                             <div className="flex-1 space-y-2">
                                {/* Question Text */}
                                <input 
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-indigo-500 outline-none" 
                                  placeholder="Question prompt..." 
                                  value={q.questionText}
                                  onChange={e => updateQuestion(pIdx, sIdx, qIdx, "questionText", e.target.value)}
                                />
                                
                                {/* Correct Answer */}
                                <div className="flex gap-2">
                                  <input 
                                    className="flex-1 border border-green-200 bg-green-50 rounded p-2 text-sm text-green-800 placeholder-green-700/50 outline-none" 
                                    placeholder="Correct Answer" 
                                    value={q.answers[0]?.answerText || ""}
                                    onChange={e => updateAnswer(pIdx, sIdx, qIdx, e.target.value)}
                                  />
                                </div>
                                
                                {/* Option fields if Multiple Choice */}
                                {section.questionType === 'multiple_choice' && (
                                   <div className="text-xs text-gray-500 italic">
                                      * Options (A, B, C...) will be managed in &quot;Question Options&quot; (Cần thêm logic UI nếu muốn chi tiết hơn)
                                   </div>
                                )}
                             </div>
                             <button 
                                onClick={() => {
                                  const newParts = [...parts];
                                  newParts[pIdx].sections[sIdx].questions = newParts[pIdx].sections[sIdx].questions.filter((_, i) => i !== qIdx);
                                  setParts(newParts);
                                }}
                                className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition"
                             >
                               <Trash2 size={16}/>
                             </button>
                          </div>
                       ))}
                       <button onClick={() => addQuestion(pIdx, sIdx)} className="text-xs flex items-center gap-1 text-indigo-600 font-semibold hover:underline mt-2">
                          <Plus size={14}/> Add Question
                       </button>
                    </div>

                  </div>
                ))}
                
                <button 
                  onClick={() => addSection(pIdx)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 font-medium transition flex justify-center items-center gap-2"
                >
                  <Plus size={18}/> Add New Section
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD PART BUTTON */}
        <div className="text-center pt-4">
           <button onClick={addPart} className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-black shadow-lg flex items-center gap-2 mx-auto transition transform hover:scale-105">
              <Plus size={20}/> Add New Part
           </button>
        </div>

      </div>
    </div>
  );
}