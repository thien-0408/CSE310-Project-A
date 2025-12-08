/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Music,
  Image as ImageIcon,
  FileAudio,
  CheckCircle2,
  Map,
  List,
  Type,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastNotification"; // Đảm bảo đường dẫn đúng tới Toast của bạn

// --- TYPES (Mapping DTO Backend) ---

type ListeningOption = {
  key: string;
  text: string;
};

type ListeningAnswer = {
  answerText: string;
};

type ListeningQuestion = {
  tempId: number; // Frontend ID for keys
  questionNumber: number;
  questionText: string;
  label?: string;
  value?: string;
  isInput?: boolean;
  wordLimit?: string;
  options: ListeningOption[]; // Options riêng của câu hỏi (MCQ)
  answers: ListeningAnswer[];
};

type ListeningSection = {
  sectionNumber: number;
  sectionTitle: string;
  sectionRange: string;
  questionType: string;
  instructions: string;
  wordLimit?: string;
  maxAnswers?: number;
  // Map/Diagram Image
  mapImageUrl?: string;
  mapImageFile?: File | null;
  // Options dùng chung cho cả Section (Matching/Diagram)
  sectionOptions?: ListeningOption[];
  questions: ListeningQuestion[];
};

type ListeningPart = {
  partNumber: number;
  partTitle: string;
  context: string;
  questionRange: string;
  audioFile?: File | null;
  sections: ListeningSection[];
};

export default function CreateListeningTest() {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  // Test Metadata
  const [title, setTitle] = useState("New Listening Test");
  const [subTitle, setSubTitle] = useState("");
  const [questionRange, setQuestionRange] = useState("1-40");
  const [audioDuration, setAudioDuration] = useState(30);

  // Test Files
  const [testImage, setTestImage] = useState<File | null>(null);
  const [testAudio, setTestAudio] = useState<File | null>(null);

  // Parts Data
  const [parts, setParts] = useState<ListeningPart[]>([
    {
      partNumber: 1,
      partTitle: "Part 1",
      context: "Conversation...",
      questionRange: "1-10",
      sections: [],
    },
  ]);

  // =========================================================================
  // HANDLERS: PART
  // =========================================================================
  const addPart = () => {
    setParts([
      ...parts,
      {
        partNumber: parts.length + 1,
        partTitle: `Part ${parts.length + 1}`,
        context: "",
        questionRange: "",
        sections: [],
      },
    ]);
  };

  const updatePart = (
    index: number,
    field: keyof ListeningPart,
    value: unknown
  ) => {
    const newParts = [...parts];
    newParts[index] = { ...newParts[index], [field]: value };
    setParts(newParts);
  };

  const handlePartAudioChange = (index: number, file: File | null) => {
    const newParts = [...parts];
    newParts[index].audioFile = file;
    setParts(newParts);
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  // =========================================================================
  // HANDLERS: SECTION
  // =========================================================================
  const addSection = (partIndex: number) => {
    const newParts = [...parts];
    newParts[partIndex].sections.push({
      sectionNumber: newParts[partIndex].sections.length + 1,
      sectionTitle: "Questions 1-5",
      sectionRange: "",
      questionType: "form_completion", // default
      instructions: "Write ONE WORD AND/OR A NUMBER",
      sectionOptions: [],
      questions: [],
    });
    setParts(newParts);
  };

  const updateSection = (
    pIdx: number,
    sIdx: number,
    field: keyof ListeningSection,
    value: unknown
  ) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx] = {
      ...newParts[pIdx].sections[sIdx],
      [field]: value,
    };

    // Auto-init question options if switching to MCQ
    if (field === "questionType" && value === "multiple_choice") {
      newParts[pIdx].sections[sIdx].questions.forEach((q) => {
        if (q.options.length === 0) {
          q.options = [
            { key: "A", text: "" },
            { key: "B", text: "" },
            { key: "C", text: "" },
          ];
        }
      });
    }
    setParts(newParts);
  };

  // --- Handler Upload Ảnh cho Map/Diagram ---
  const handleSectionMapChange = (
    pIdx: number,
    sIdx: number,
    file: File | null
  ) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx] = {
      ...newParts[pIdx].sections[sIdx],
      mapImageFile: file, // Lưu file vào state để submit
    };
    setParts(newParts);
  };

  const removeSection = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    newParts[pIdx].sections = newParts[pIdx].sections.filter(
      (_, i) => i !== sIdx
    );
    setParts(newParts);
  };

  // =========================================================================
  // HANDLERS: SECTION OPTIONS (Global Options for Matching/Diagram)
  // =========================================================================
  const addSectionOption = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    const section = newParts[pIdx].sections[sIdx];
    
    // Auto generate Key: A, B, C...
    const currentLength = section.sectionOptions?.length || 0;
    const nextKey = String.fromCharCode(65 + currentLength);

    if (!section.sectionOptions) section.sectionOptions = [];
    
    section.sectionOptions.push({
      key: nextKey,
      text: ""
    });
    setParts(newParts);
  };

  const updateSectionOption = (
    pIdx: number,
    sIdx: number,
    optIdx: number,
    field: keyof ListeningOption,
    value: string
  ) => {
    const newParts = [...parts];
    if (newParts[pIdx].sections[sIdx].sectionOptions) {
      newParts[pIdx].sections[sIdx].sectionOptions![optIdx][field] = value;
    }
    setParts(newParts);
  };

  const removeSectionOption = (pIdx: number, sIdx: number, optIdx: number) => {
    const newParts = [...parts];
    if (newParts[pIdx].sections[sIdx].sectionOptions) {
      newParts[pIdx].sections[sIdx].sectionOptions = newParts[
        pIdx
      ].sections[sIdx].sectionOptions!.filter((_, i) => i !== optIdx);
    }
    setParts(newParts);
  };

  // =========================================================================
  // HANDLERS: QUESTION
  // =========================================================================
  const addQuestion = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    const section = newParts[pIdx].sections[sIdx];
    const qNum = Math.floor(Math.random() * 100000); // Temp ID

    let initOptions: ListeningOption[] = [];
    if (section.questionType === "multiple_choice") {
      initOptions = [
        { key: "A", text: "" },
        { key: "B", text: "" },
        { key: "C", text: "" },
      ];
    }

    section.questions.push({
      tempId: qNum,
      questionNumber: 0,
      questionText: "",
      isInput: true,
      options: initOptions,
      answers: [{ answerText: "" }],
    });
    setParts(newParts);
  };

  const updateQuestion = (
    pIdx: number,
    sIdx: number,
    qIdx: number,
    field: keyof ListeningQuestion,
    value: unknown
  ) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions[qIdx] = {
      ...newParts[pIdx].sections[sIdx].questions[qIdx],
      [field]: value,
    };
    setParts(newParts);
  };

  const updateOption = (
    pIdx: number,
    sIdx: number,
    qIdx: number,
    optIdx: number,
    text: string
  ) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions[qIdx].options[optIdx].text = text;
    setParts(newParts);
  };

  const updateAnswer = (
    pIdx: number,
    sIdx: number,
    qIdx: number,
    text: string
  ) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions[qIdx].answers[0].answerText = text;
    setParts(newParts);
  };

  const removeQuestion = (pIdx: number, sIdx: number, qIdx: number) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions = newParts[pIdx].sections[
      sIdx
    ].questions.filter((_, i) => i !== qIdx);
    setParts(newParts);
  };

  // =========================================================================
  // SUBMIT LOGIC
  // =========================================================================
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("SubTitle", subTitle);
      formData.append("QuestionRange", questionRange);
      formData.append("AudioDuration", audioDuration.toString());

      if (testImage) formData.append("TestImageFile", testImage);
      if (testAudio) formData.append("TestAudioFile", testAudio);

      // 1. Prepare JSON Data (Exclude File objects)
      let globalQCount = 1;
      const partsJson = parts.map((p, pIndex) => ({
        PartNumber: pIndex + 1,
        PartTitle: p.partTitle,
        Context: p.context,
        QuestionRange: p.questionRange,
        Sections: p.sections.map((s, sIndex) => ({
          SectionNumber: sIndex + 1,
          SectionTitle: s.sectionTitle,
          SectionRange: s.sectionRange,
          QuestionType: s.questionType,
          Instructions: s.instructions,
          WordLimit: s.wordLimit,
          MaxAnswers: s.maxAnswers,
          // Map Section Options (for Matching/Diagram)
          SectionOptions: s.sectionOptions?.map(opt => ({
             Key: opt.key,
             Text: opt.text
          })) || [],
          // Map Questions
          Questions: s.questions.map((q) => ({
            QuestionNumber: globalQCount++, 
            QuestionText: q.questionText,
            Label: q.label,
            Value: q.value,
            IsInput: q.isInput,
            WordLimit: q.wordLimit,
            Options: q.options,
            Answers: q.answers,
          })),
        })),
      }));

      formData.append("PartsJson", JSON.stringify(partsJson));

      // 2. Append Part Audios (Strict Index Order)
      parts.forEach((part) => {
        if (part.audioFile) {
          formData.append("PartAudioFiles", part.audioFile);
        } else {
          // Placeholder for missing audio to keep index sync
          formData.append("PartAudioFiles", new Blob(), "empty.mp3");
        }
      });

      // 3. Append Section Images (Flattened List for Map/Diagram)
      let totalSectionsCheck = 0;
      parts.forEach((part) => {
        part.sections.forEach((section) => {
          totalSectionsCheck++; 
          
          // Check if Section type allows image upload AND file exists
          const isMapOrDiagram = section.questionType === "map_labeling" || section.questionType === "diagram_labeling";
          
          if (isMapOrDiagram && section.mapImageFile) {
            formData.append("SectionMapImages", section.mapImageFile);
          } else {
            // Placeholder blob
            formData.append("SectionMapImages", new Blob([], { type: 'application/octet-stream' }), "empty.png");
          }
        });
      });
      console.log(`Total sections flattened: ${totalSectionsCheck}`);

      // 4. Send Request
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        "http://localhost:5151/api/listening/create-listening",
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      console.log(data);
      showToast(`Listening Test Created! ID: ${data.testId}`, "success");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      showToast(e.message || "Error occured", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // RENDER UI
  // =========================================================================
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 mt-5 pb-20">
      <div className="mx-auto space-y-8 px-4">
        <ToastComponent />
        
        {/* --- PAGE TITLE --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-3 mb-6">
            <Music className="w-8 h-8 text-blue-700" />
            <h1 className="text-2xl font-bold text-gray-900">Create Listening Test</h1>
          </div>

          {/* --- METADATA --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Test Title</label>
                <input
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cambridge IELTS 18 Test 1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                <input
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="e.g. Full Listening Practice"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Range</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                    value={questionRange}
                    onChange={(e) => setQuestionRange(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Duration (min)</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                    value={audioDuration}
                    onChange={(e) => setAudioDuration(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded border border-dashed border-gray-300">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                  <ImageIcon size={16} /> Test Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTestImage(e.target.files?.[0] || null)}
                  className="text-xs w-full text-gray-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                  <FileAudio size={16} /> Main Audio (Full Test)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setTestAudio(e.target.files?.[0] || null)}
                  className="text-xs w-full text-gray-500"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
              >
                <Save size={18} /> {isLoading ? "Saving..." : "Save Listening Test"}
              </button>
            </div>
          </div>
        </div>

        {/* --- PARTS LOOP --- */}
        {parts.map((part, pIdx) => (
          <div
            key={pIdx}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Part Header */}
            <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-purple-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-1">
                  <span className="font-bold text-purple-800 whitespace-nowrap bg-purple-100 px-2 py-1 rounded text-xs">
                    PART {pIdx + 1}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <input
                    className="w-full bg-white border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none font-semibold"
                    value={part.partTitle}
                    onChange={(e) => updatePart(pIdx, "partTitle", e.target.value)}
                    placeholder="Part Title"
                  />
                </div>
                <div className="md:col-span-4">
                  <input
                    className="w-full bg-white border border-purple-200 rounded px-3 py-1.5 text-sm outline-none"
                    value={part.context}
                    onChange={(e) => updatePart(pIdx, "context", e.target.value)}
                    placeholder="Context / Description..."
                  />
                </div>

                {/* Part Audio Upload */}
                <div className="md:col-span-3 flex items-center gap-2 bg-white px-2 py-1.5 rounded border border-purple-200">
                  <FileAudio size={16} className="text-purple-600 flex-shrink-0" />
                  <input
                    type="file"
                    accept="audio/*"
                    className="text-[10px] w-full text-gray-500"
                    onChange={(e) =>
                      handlePartAudioChange(pIdx, e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => removePart(pIdx)}
                className="text-gray-400 hover:text-red-500 p-2"
                title="Remove Part"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Sections Area */}
            <div className="p-4 space-y-6 bg-slate-50/50">
              {part.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="border border-gray-300 bg-white rounded-lg p-5 relative shadow-sm"
                >
                  <button
                    onClick={() => removeSection(pIdx, sIdx)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500"
                    title="Remove Section"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Section Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                        Question Type
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded p-2 text-sm font-semibold text-blue-700 bg-gray-50"
                        value={section.questionType}
                        onChange={(e) =>
                          updateSection(pIdx, sIdx, "questionType", e.target.value)
                        }
                      >
                        <option value="form_completion">Form Completion</option>
                        <option value="note_completion">Note Completion</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="sentence_completion">Sentence Completion</option>
                        <option value="summary_completion">Summary Completion</option>
                        <option value="map_labeling">Map Labeling</option>
                        <option value="diagram_labeling">Diagram Labeling</option>
                        <option value="matching_information">Matching Information</option>
                        <option value="matching_names">Matching Names</option>
                        <option value="matching_headings">Matching Headings</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                        Range
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        value={section.sectionRange}
                        onChange={(e) => updateSection(pIdx, sIdx, "sectionRange", e.target.value)}
                        placeholder="e.g. 1-5"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                        Instructions
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        value={section.instructions}
                        onChange={(e) => updateSection(pIdx, sIdx, "instructions", e.target.value)}
                        placeholder="e.g. Write NO MORE THAN TWO WORDS..."
                      />
                    </div>
                  </div>

                  {/* --- DYNAMIC UI: IMAGE UPLOAD (Map/Diagram) --- */}
                  {(section.questionType === "map_labeling" || section.questionType === "diagram_labeling") && (
                    <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center gap-4">
                      <div className="bg-yellow-100 p-2 rounded-full">
                         <Map className="text-yellow-700" size={24} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-yellow-800 block mb-1">
                          {section.questionType === "map_labeling" ? "Upload Map Image" : "Upload Diagram Image"}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="text-xs block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
                          onChange={(e) =>
                            handleSectionMapChange(pIdx, sIdx, e.target.files?.[0] || null)
                          }
                        />
                        {section.mapImageFile && (
                          <div className="flex items-center gap-1 mt-2">
                             <CheckCircle2 size={12} className="text-green-600"/>
                             <p className="text-[10px] text-green-700 font-bold">
                               Selected: {section.mapImageFile.name}
                             </p>
                          </div>
                        )}
                        {!section.mapImageFile && (
                           <p className="text-[10px] text-gray-400 mt-1 italic">No file selected</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- DYNAMIC UI: SECTION OPTIONS (Matching/Diagram) --- */}
                  {(section.questionType.includes("matching") || section.questionType === "diagram_labeling") && (
                    <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                           <List size={16} className="text-indigo-700"/>
                           <label className="text-xs font-bold text-indigo-800 uppercase">
                             Shared Options / Headings (A, B, C...)
                           </label>
                        </div>
                        <button
                          onClick={() => addSectionOption(pIdx, sIdx)}
                          className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 font-bold transition"
                        >
                          + Add Option
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.sectionOptions?.map((opt, optIdx) => (
                          <div key={optIdx} className="flex gap-1 items-center bg-white p-1.5 rounded border border-indigo-100 shadow-sm">
                            <div className="bg-indigo-50 px-2 py-1 rounded">
                               <input
                                 className="w-8 text-center text-xs font-bold text-indigo-700 bg-transparent outline-none"
                                 value={opt.key}
                                 onChange={(e) => updateSectionOption(pIdx, sIdx, optIdx, "key", e.target.value)}
                               />
                            </div>
                            <input
                              className="flex-1 text-xs px-2 outline-none text-gray-700 font-medium"
                              placeholder="Option text (e.g. Library, Paragraph A)"
                              value={opt.text}
                              onChange={(e) => updateSectionOption(pIdx, sIdx, optIdx, "text", e.target.value)}
                            />
                            <button 
                              onClick={() => removeSectionOption(pIdx, sIdx, optIdx)}
                              className="text-gray-400 hover:text-red-500 px-2"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {(!section.sectionOptions || section.sectionOptions.length === 0) && (
                          <p className="text-[10px] text-gray-500 italic col-span-2 text-center py-2">
                            No shared options added yet. Click &quot;+ Add Option&ldquo; to start.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-3 pl-4 border-l-4 border-gray-100">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Questions</h5>
                    {section.questions.map((q, qIdx) => (
                      <div
                        key={q.tempId}
                        className="flex gap-3 items-start group p-3 rounded-md hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                      >
                        <div className="mt-2 text-xs font-bold text-gray-400 w-8">
                          Q{qIdx + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          {/* Question Text */}
                          <div className="flex items-center gap-2">
                             <Type size={14} className="text-gray-400"/>
                             <input
                               className="w-full border-b border-gray-300 bg-transparent focus:border-blue-500 outline-none text-sm py-1 font-medium text-gray-800"
                               placeholder="Question text..."
                               value={q.questionText}
                               onChange={(e) =>
                                 updateQuestion(pIdx, sIdx, qIdx, "questionText", e.target.value)
                               }
                             />
                          </div>

                          {/* Correct Answer */}
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-600" />
                            <input
                              className="flex-1 bg-green-50 border border-green-200 rounded px-2 py-1.5 text-xs text-green-800 font-semibold placeholder:text-green-800/50 outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="Correct Answer"
                              value={q.answers[0]?.answerText || ""}
                              onChange={(e) =>
                                updateAnswer(pIdx, sIdx, qIdx, e.target.value)
                              }
                            />
                          </div>

                          {/* Individual MCQ Options (Specific to Multiple Choice) */}
                          {section.questionType === "multiple_choice" && (
                            <div className="grid grid-cols-1 gap-2 mt-2 pl-6">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <span className="font-bold text-xs w-4 text-center bg-gray-200 rounded text-gray-600">{opt.key}</span>
                                  <input
                                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-400"
                                    value={opt.text}
                                    placeholder={`Option ${opt.key}`}
                                    onChange={(e) =>
                                      updateOption(pIdx, sIdx, qIdx, oIdx, e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeQuestion(pIdx, sIdx, qIdx)}
                          className="text-gray-300 hover:text-red-500 pt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove Question"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => addQuestion(pIdx, sIdx)}
                      className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-3 px-3 py-1.5 rounded hover:bg-blue-50 transition w-fit"
                    >
                      <Plus size={14} /> Add Question
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => addSection(pIdx)}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600 font-medium transition flex justify-center items-center gap-2"
              >
                <Plus size={18} /> Add Section to Part {pIdx + 1}
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-8">
          <button
            onClick={addPart}
            className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-black shadow-lg flex items-center gap-2 transition transform hover:scale-105 font-bold"
          >
            <Plus size={20} /> Add New Part
          </button>
        </div>
      </div>
    </div>
  );
}