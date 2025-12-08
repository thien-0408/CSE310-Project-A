/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, Image as ImageIcon, Type, Grid, FileText, List, CheckCircle2 } from "lucide-react";
import { FaBookOpen } from "react-icons/fa";
import { useToast } from "@/components/ui/ToastNotification";

type Question = {
  tempId: number; 
  question: string;
  answer: string | string[]; 
  options?: string[]; 
  diagram?: string[]; 
};

type Section = {
  sectionTitle: string;
  sectionRange: string;
  questionType: string;
  instructions: string;
  wordLimit?: string;
  text?: string; 
  headings?: string[]; 
  matchingOptions?: string[]; 
  diagramImageUrl?: string;   
  table?: { columns: string[]; rows: string[][] }; 
  
  questions: Question[];
};

type Part = {
  partNumber: number; 
  partTitle: string;
  passageTitle: string;
  text: string; 
  sections: Section[];
};

export default function CreateReadingTest() {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("New Reading Test");
  const { showToast, ToastComponent } = useToast();
  const [subtitle, setSubtitle] = useState(""); 
  
  const [testType, setTestType] = useState("full_test");
  const [totalDuration, setTotalDuration] = useState(60);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [parts, setParts] = useState<Part[]>([
    { partNumber: 1, partTitle: "Reading Passage 1", passageTitle: "", text: "", sections: [] }
  ]);

  // --- HANDLERS (Giữ nguyên logic cũ) ---
  const addPart = () => {
    setParts([...parts, {
      partNumber: parts.length + 1,
      partTitle: `Reading Passage ${parts.length + 1}`,
      passageTitle: "",
      text: "",
      sections: []
    }]);
  };

  const updatePart = (index: number, field: keyof Part, value: unknown) => {
    const newParts = [...parts];
    newParts[index] = { ...newParts[index], [field]: value };
    setParts(newParts);
  };

  const removePart = (index: number) => {
      const newParts = parts.filter((_, i) => i !== index);
      setParts(newParts);
  }

  const addSection = (partIndex: number) => {
    const newParts = [...parts];
    newParts[partIndex].sections.push({
      sectionTitle: "Multiple Choice",
      sectionRange: "",
      questionType: "multiple_choice",
      instructions: "Choose the correct letter, A, B, C or D.",
      questions: []
    });
    setParts(newParts);
  };

  const updateSection = (pIdx: number, sIdx: number, field: keyof Section, value: unknown) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx] = { ...newParts[pIdx].sections[sIdx], [field]: value };
    
    if (field === 'questionType') {
        const section = newParts[pIdx].sections[sIdx];
        if (value === 'table_completion' && !section.table) {
            section.table = { columns: ["Column 1", "Column 2"], rows: [["", ""]] };
        }
        section.questions.forEach(q => {
            if (value === 'multiple_choice') {
                if (!q.options || q.options.length === 0) q.options = ["", "", "", ""];
            } else {
                q.options = [];
            }
            q.answer = "";
        });
    }
    setParts(newParts);
  };

  const removeSection = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    newParts[pIdx].sections = newParts[pIdx].sections.filter((_, i) => i !== sIdx);
    setParts(newParts);
  };

  const addQuestion = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    const section = newParts[pIdx].sections[sIdx];
    const newId = Math.floor(Math.random() * 10000000); 
    const defaultOptions = section.questionType === 'multiple_choice' ? ["", "", "", ""] : [];

    section.questions.push({
      tempId: newId,
      question: "",
      answer: "",
      options: defaultOptions
    });
    setParts(newParts);
  };

  const updateQuestion = (pIdx: number, sIdx: number, qIdx: number, field: keyof Question, value: unknown) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions[qIdx] = { ...newParts[pIdx].sections[sIdx].questions[qIdx], [field]: value };
    setParts(newParts);
  };

  const removeQuestion = (pIdx: number, sIdx: number, qIdx: number) => {
    const newParts = [...parts];
    newParts[pIdx].sections[sIdx].questions = newParts[pIdx].sections[sIdx].questions.filter((_, i) => i !== qIdx);
    setParts(newParts);
  };

  const handleListUpdate = (pIdx: number, sIdx: number, listField: 'headings' | 'matchingOptions', val: string) => {
      const newParts = [...parts];
      newParts[pIdx].sections[sIdx][listField] = val.split('\n');
      setParts(newParts);
  }

  const handleTableStructure = (pIdx: number, sIdx: number, type: 'col' | 'row', action: 'add' | 'update', index: number = 0, val: string = "") => {
      const newParts = [...parts];
      const section = newParts[pIdx].sections[sIdx];
      if (!section.table) section.table = { columns: ["Col 1"], rows: [[""]] };

      if (type === 'col') {
          if (action === 'add') {
              section.table.columns.push(`Col ${section.table.columns.length + 1}`);
              section.table.rows.forEach(row => row.push(""));
          } else {
              section.table.columns[index] = val;
          }
      } else {
          if (action === 'add') {
              section.table.rows.push(new Array(section.table.columns.length).fill(""));
          }
      }
      setParts(newParts);
  };

  const handleTableCell = (pIdx: number, sIdx: number, rIdx: number, cIdx: number, val: string) => {
      const newParts = [...parts];
      if (newParts[pIdx].sections[sIdx].table) {
          newParts[pIdx].sections[sIdx].table!.rows[rIdx][cIdx] = val;
      }
      setParts(newParts);
  }

  // --- SUBMIT ---
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let globalQuestionCounter = 1;

      const formattedParts = parts.map((part, pIndex) => ({
          PartNumber: pIndex + 1,
          Text: part.text,
          Sections: part.sections.map((section, sIndex) => {
              const processedQuestions = section.questions.map((q) => {
                  const qNum = globalQuestionCounter++;
                  return {
                      QuestionNumber: qNum,
                      Question: q.question,
                      Answer: q.answer,
                      Options: q.options,
                      Diagram: q.diagram
                  };
              });

              return {
                  SectionNumber: sIndex + 1,
                  SectionTitle: section.sectionTitle,
                  SectionRange: section.sectionRange,
                  QuestionType: section.questionType,
                  Instructions: section.instructions,
                  WordLimit: section.wordLimit,
                  Headings: section.headings,
                  MatchingOptions: section.matchingOptions,
                  Table: section.table,
                  DiagramImageUrl: section.diagramImageUrl,
                  Text: section.text,
                  Questions: processedQuestions
              };
          })
      }));

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Subtitle", subtitle); 
      formData.append("TestType", testType);
      formData.append("Skill", "Reading");
      formData.append("TotalDuration", totalDuration.toString());
      formData.append("Parts", JSON.stringify(formattedParts));

      if (imageFile) formData.append("Image", imageFile);

      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5151/api/reading-test/add-reading-test", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      showToast(`Test created successfully! ID: ${data.testId}`, "success");
      
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI HELPER: Answer Input ---
  const renderAnswerInput = (section: Section, q: Question, pIdx: number, sIdx: number, qIdx: number) => {
      if (section.questionType === 'multiple_choice') {
          return (
            <div className="flex items-center gap-2 mt-1">
                <CheckCircle2 size={14} className="text-green-600" />
                <select className="border border-green-200 bg-green-50 text-xs rounded px-2 py-1 font-bold text-green-700 outline-none"
                    value={q.answer as string}
                    onChange={e => updateQuestion(pIdx, sIdx, qIdx, "answer", e.target.value)}>
                    <option value="">Select Answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>
          );
      }
      
      if (['true_false_not_given', 'yes_no_not_given'].includes(section.questionType)) {
          const isYesNo = section.questionType === 'yes_no_not_given';
          return (
            <div className="flex items-center gap-2 mt-1">
                <CheckCircle2 size={14} className="text-green-600" />
                <select className="border border-green-200 bg-green-50 text-xs rounded px-2 py-1 font-bold text-green-700 outline-none w-full"
                    value={q.answer as string}
                    onChange={e => updateQuestion(pIdx, sIdx, qIdx, "answer", e.target.value)}>
                    <option value="">Select Answer</option>
                    <option value={isYesNo ? "Yes" : "True"}>{isYesNo ? "Yes" : "True"}</option>
                    <option value={isYesNo ? "No" : "False"}>{isYesNo ? "No" : "False"}</option>
                    <option value="Not Given">Not Given</option>
                </select>
            </div>
          );
      }

      return (
        <div className="flex items-center gap-2 mt-1 w-full">
            <CheckCircle2 size={14} className="text-green-600" />
            <input className="flex-1 bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-800 placeholder-green-700/50 font-semibold outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Correct Answer..."
                value={Array.isArray(q.answer) ? q.answer.join(',') : q.answer}
                onChange={e => updateQuestion(pIdx, sIdx, qIdx, "answer", e.target.value)}
            />
        </div>
      );
  }

  // --- RENDER MAIN UI ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 mt-5 pb-24">
      <div className="mx-auto space-y-8 px-4">
        <ToastComponent />
        
        {/* --- PAGE HEADER --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-3 mb-6">
            <FaBookOpen className="w-8 h-8 text-blue-700" />
            <h1 className="text-2xl font-bold text-gray-900">Create Reading Test</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Test Title</label>
                <input
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cambridge 18 Test 1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Subtitle / Tags</label>
                <input
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Academic Reading"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Test Type</label>
                  <select 
                    value={testType} 
                    onChange={e => setTestType(e.target.value)} 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                  >
                    <option value="full_test">Full Test</option>
                    <option value="separated_test">Separated Test</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Duration (min)</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
                    value={totalDuration}
                    onChange={(e) => setTotalDuration(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="bg-gray-50 p-4 rounded border border-dashed border-gray-300 h-full flex flex-col justify-center">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2 cursor-pointer">
                    <ImageIcon size={16} /> {imageFile ? "Change Cover Image" : "Upload Cover Image"}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="hidden"
                    />
                  </label>
                  <div className="text-xs text-gray-400 italic">
                      {imageFile ? <span className="text-green-600 font-bold">{imageFile.name}</span> : "No file selected"}
                  </div>
               </div>
            </div>
            
            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
              >
                <Save size={18} /> {isLoading ? "Saving..." : "Save Reading Test"}
              </button>
            </div>
          </div>
        </div>

        {/* --- PARTS LOOP --- */}
        {parts.map((part, pIdx) => (
            <div key={pIdx} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Part Header */}
                <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-purple-100 flex justify-between items-center">
                    <div className="flex gap-4 items-center flex-1">
                        <span className="font-bold text-purple-800 whitespace-nowrap bg-purple-100 px-2 py-1 rounded text-xs">
                            PASSAGE {pIdx + 1}
                        </span>
                        <input className="flex-1 bg-transparent border-b border-transparent hover:border-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-800 text-sm py-1 transition-colors" 
                            value={part.passageTitle} 
                            onChange={e => updatePart(pIdx, "passageTitle", e.target.value)} 
                            placeholder="Enter Passage Title (e.g. The Future of AI)..."
                        />
                    </div>
                    <button onClick={() => removePart(pIdx)} className="text-gray-400 hover:text-red-500 ml-4 p-2"><Trash2 size={18}/></button>
                </div>
                
                {/* 2-Column Layout */}
                <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/30">
                    
                    {/* LEFT: READING TEXT */}
                    <div className="flex flex-col h-full">
                        <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-2">
                            <FileText size={12}/> Passage Content
                        </label>
                        <textarea 
                            className="flex-1 w-full min-h-[500px] border border-gray-300 rounded-lg p-4 text-sm font-serif leading-7 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none resize-none shadow-inner"
                            value={part.text}
                            onChange={e => updatePart(pIdx, "text", e.target.value)}
                            placeholder="Paste the full reading text here..."
                        />
                    </div>

                    {/* RIGHT: SECTIONS & QUESTIONS */}
                    <div className="flex flex-col h-full max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-10">
                        <div className="space-y-6">
                            {part.sections.map((section, sIdx) => (
                                <div key={sIdx} className="border border-gray-300 bg-white rounded-lg p-5 relative shadow-sm">
                                    <button
                                        onClick={() => removeSection(pIdx, sIdx)}
                                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Remove Section"
                                    >
                                        <Trash2 size={16}/>
                                    </button>

                                    {/* Section Controls */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Question Type</label>
                                            <select className="w-full bg-slate-50 border border-gray-300 rounded p-2 text-sm font-semibold text-blue-700 outline-none focus:border-blue-500"
                                                value={section.questionType}
                                                onChange={e => updateSection(pIdx, sIdx, "questionType", e.target.value)}>
                                                <optgroup label="Common">
                                                    <option value="multiple_choice">Multiple Choice</option>
                                                    <option value="true_false_not_given">True/False/Not Given</option>
                                                    <option value="yes_no_not_given">Yes/No/Not Given</option>
                                                </optgroup>
                                                <optgroup label="Completion">
                                                    <option value="gap_filling">Gap Filling / Summary (Text)</option>
                                                    <option value="sentence_completion">Sentence Completion</option>
                                                    <option value="short_answer">Short Answer</option>
                                                    <option value="summary_completion">Summary Completion (Options)</option>
                                                </optgroup>
                                                <optgroup label="Matching & Labeling">
                                                    <option value="matching_headings">Matching Headings</option>
                                                    <option value="matching_names">Matching Names</option>
                                                    <option value="table_completion">Table Completion</option>
                                                    <option value="diagram_labeling">Diagram Labeling</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Range</label>
                                            <input className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-400" 
                                                value={section.sectionRange} 
                                                onChange={e => updateSection(pIdx, sIdx, "sectionRange", e.target.value)} 
                                                placeholder="Q 1-5"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Title</label>
                                            <input className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-400" 
                                                value={section.sectionTitle} 
                                                onChange={e => updateSection(pIdx, sIdx, "sectionTitle", e.target.value)} 
                                                placeholder="e.g. Questions 1-5"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Instructions</label>
                                            <input className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-400" 
                                                value={section.instructions} 
                                                onChange={e => updateSection(pIdx, sIdx, "instructions", e.target.value)} 
                                                placeholder="e.g. Choose the correct letter..."
                                            />
                                        </div>
                                    </div>

                                    {/* --- SPECIAL UI BLOCKS (Technical Boxes) --- */}
                                    
                                    {/* 1. Matching Headings */}
                                    {section.questionType === 'matching_headings' && (
                                        <div className="mb-6 bg-indigo-50 p-3 rounded border border-indigo-200">
                                            <label className="text-[10px] font-bold text-indigo-800 uppercase mb-2 flex items-center gap-1"><List size={12}/> List of Headings (One per line)</label>
                                            <textarea className="w-full border border-indigo-200 rounded p-2 text-xs h-24 focus:ring-1 focus:ring-indigo-300 outline-none"
                                                placeholder="i. Introduction&#10;ii. History..."
                                                onChange={e => handleListUpdate(pIdx, sIdx, 'headings', e.target.value)}
                                                defaultValue={section.headings?.join('\n')}
                                            />
                                        </div>
                                    )}

                                    {/* 2. Matching Names */}
                                    {section.questionType === 'matching_names' && (
                                        <div className="mb-6 bg-indigo-50 p-3 rounded border border-indigo-200">
                                            <label className="text-[10px] font-bold text-indigo-800 uppercase mb-2 flex items-center gap-1"><List size={12}/> List of Names (One per line)</label>
                                            <textarea className="w-full border border-indigo-200 rounded p-2 text-xs h-24 focus:ring-1 focus:ring-indigo-300 outline-none"
                                                placeholder="A. David Attenborough&#10;B. Paul Pearce-Kelly..."
                                                onChange={e => handleListUpdate(pIdx, sIdx, 'matchingOptions', e.target.value)}
                                                defaultValue={section.matchingOptions?.join('\n')}
                                            />
                                        </div>
                                    )}

                                    {/* 3. Diagram Labeling */}
                                    {section.questionType === 'diagram_labeling' && (
                                        <div className="mb-6 bg-yellow-50 p-3 rounded border border-yellow-200">
                                            <label className="text-[10px] font-bold text-yellow-800 uppercase mb-2 flex items-center gap-1"><ImageIcon size={12}/> Diagram Image URL</label>
                                            <input className="w-full border border-yellow-300 rounded p-2 text-xs focus:ring-1 focus:ring-yellow-400 outline-none"
                                                placeholder="/images/diagram1.jpg"
                                                value={section.diagramImageUrl || ""}
                                                onChange={e => updateSection(pIdx, sIdx, "diagramImageUrl", e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {/* 4. Table Completion */}
                                    {section.questionType === 'table_completion' && (
                                        <div className="mb-6 overflow-x-auto bg-white p-3 rounded border border-gray-200 shadow-inner">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex gap-1"><Grid size={12}/> Table Structure</label>
                                            <div className="flex gap-2 mb-2">
                                                <button onClick={() => handleTableStructure(pIdx, sIdx, 'col', 'add')} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ Add Column</button>
                                                <button onClick={() => handleTableStructure(pIdx, sIdx, 'row', 'add')} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ Add Row</button>
                                            </div>
                                            <table className="w-full text-xs border-collapse">
                                                <thead>
                                                    <tr>
                                                        {section.table?.columns.map((col, cIdx) => (
                                                            <th key={cIdx} className="border p-1 bg-gray-100 min-w-[100px]">
                                                                <input className="bg-transparent w-full font-bold outline-none text-center" value={col} onChange={e => handleTableStructure(pIdx, sIdx, 'col', 'update', cIdx, e.target.value)} />
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {section.table?.rows.map((row, rIdx) => (
                                                        <tr key={rIdx}>
                                                            {row.map((cell, cIdx) => (
                                                                <td key={cIdx} className="border p-1">
                                                                    <input className="w-full outline-none p-1" value={cell} onChange={e => handleTableCell(pIdx, sIdx, rIdx, cIdx, e.target.value)} placeholder="Text or __gap__"/>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* QUESTIONS LIST */}
                                    <div className="space-y-3 pl-4 border-l-4 border-gray-100">
                                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Questions</h5>
                                        {section.questions.map((q, qIdx) => (
                                            <div key={q.tempId} className="flex gap-3 items-start group p-2 rounded hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                                <div className="mt-2 text-xs font-bold text-gray-400 w-6">Q{qIdx + 1}</div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Type size={14} className="text-gray-400"/>
                                                        <input className="w-full border-b border-gray-300 bg-transparent focus:border-blue-500 outline-none text-sm py-1 font-medium text-gray-800 placeholder-gray-300" 
                                                            placeholder="Question text..."
                                                            value={q.question}
                                                            onChange={e => updateQuestion(pIdx, sIdx, qIdx, "question", e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                    {/* MCQ Options */}
                                                    {section.questionType === 'multiple_choice' && (
                                                         <div className="grid grid-cols-2 gap-2 pl-6 mt-1">
                                                            {q.options?.map((opt, oIdx) => (
                                                                <div key={oIdx} className="flex items-center gap-1">
                                                                    <span className="font-bold text-[10px] w-3 text-gray-500">{String.fromCharCode(65+oIdx)}</span>
                                                                    <input className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-300"
                                                                        value={opt}
                                                                        placeholder={`Option`}
                                                                        onChange={e => {
                                                                            const newOpts = [...(q.options || [])];
                                                                            newOpts[oIdx] = e.target.value;
                                                                            updateQuestion(pIdx, sIdx, qIdx, "options", newOpts);
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                         </div>
                                                    )}

                                                    {renderAnswerInput(section, q, pIdx, sIdx, qIdx)}
                                                </div>
                                                <button onClick={() => removeQuestion(pIdx, sIdx, qIdx)} className="text-gray-300 hover:text-red-500 pt-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                            </div>
                                        ))}
                                        
                                        <button onClick={() => addQuestion(pIdx, sIdx)} className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-3 px-2 py-1 rounded hover:bg-blue-50 transition w-fit">
                                            <Plus size={14}/> Add Question
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <button onClick={() => addSection(pIdx)} className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600 font-medium transition flex justify-center items-center gap-2 text-sm">
                                <Plus size={16} /> Add Section to Passage {pIdx + 1}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        <div className="flex justify-center pt-8">
            <button onClick={addPart} className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-black shadow-lg flex items-center gap-2 transition transform hover:scale-105 font-bold">
                <Plus size={20}/> Add New Passage
            </button>
        </div>

      </div>
    </div>
  );
}