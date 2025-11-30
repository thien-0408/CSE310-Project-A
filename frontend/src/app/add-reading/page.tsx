"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, Image as ImageIcon, Type, FileText, Grid, List as ListIcon } from "lucide-react";

// --- TYPES ---
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
  
  // 1. ADD SUBTITLE STATE
  const [subtitle, setSubtitle] = useState(""); 
  
  const [testType, setTestType] = useState("full_test");
  const [totalDuration, setTotalDuration] = useState(60);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [parts, setParts] = useState<Part[]>([
    { partNumber: 1, partTitle: "Reading Passage 1", passageTitle: "", text: "", sections: [] }
  ]);

  // --- HANDLERS: CORE ---
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
    
    // reset data when switch question type
    if (field === 'questionType') {
        const section = newParts[pIdx].sections[sIdx];
        
        // Init table nếu chọn table
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

  // --- HANDLERS: SPECIAL UI HELPERS ---
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
      
      // APPEND SUBTITLE TO REQUEST
      formData.append("Subtitle", subtitle); 
      
      formData.append("TestType", testType);
      formData.append("Skill", "Reading");
      formData.append("TotalDuration", totalDuration.toString());
      formData.append("Parts", JSON.stringify(formattedParts));
      console.log(formData);

      if (imageFile) formData.append("Image", imageFile);

      const token = localStorage.getItem("accessToken");
      
      const res = await fetch("http://localhost:5151/api/reading-test/add-reading-test", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      alert(`Test created successfully! ID: ${data.testId}`);
      
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER INPUT HELPER ---
  const renderAnswerInput = (section: Section, q: Question, pIdx: number, sIdx: number, qIdx: number) => {
      if (section.questionType === 'multiple_choice') {
          return (
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-green-600">Ans:</span>
                <select className="border border-green-200 bg-white text-xs rounded p-1"
                    value={q.answer as string}
                    onChange={e => updateQuestion(pIdx, sIdx, qIdx, "answer", e.target.value)}>
                    <option value="">Select</option>
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
                <span className="text-xs font-bold text-green-600">Ans:</span>
                <select className="border border-green-200 bg-white text-xs rounded p-1 w-full"
                    value={q.answer as string}
                    onChange={e => updateQuestion(pIdx, sIdx, qIdx, "answer", e.target.value)}>
                    <option value="">Select</option>
                    <option value={isYesNo ? "Yes" : "True"}>{isYesNo ? "Yes" : "True"}</option>
                    <option value={isYesNo ? "No" : "False"}>{isYesNo ? "No" : "False"}</option>
                    <option value="Not Given">Not Given</option>
                </select>
            </div>
          );
      }

      return (
        <input className="w-full bg-green-50 border border-green-200 rounded p-2 text-sm text-green-800 placeholder-green-700/50"
            placeholder="Correct Answer"
            value={Array.isArray(q.answer) ? q.answer.join(',') : q.answer}
            onChange={e => updateQuestion(pIdx, sIdx, qIdx, "answer", e.target.value)}
        />
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4 flex-1 w-full">
                <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-blue-600"/> Create Reading Test</h1>
                
                {/* 3. UI FOR TITLE & SUBTITLE */}
                <div className="space-y-2">
                    <input 
                        className="w-full text-lg font-semibold border-b border-gray-300 focus:border-blue-500 outline-none pb-1" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="Enter Test Title..."
                    />
                    <input 
                        className="w-full text-sm border-b border-gray-300 focus:border-blue-500 outline-none pb-1 text-gray-600" 
                        value={subtitle} 
                        onChange={e => setSubtitle(e.target.value)} 
                        placeholder="Enter Question Types (Subtitle)... e.g. True/False, Multiple Choice"
                    />
                </div>
                
                <div className="flex gap-4">
                     <select value={testType} onChange={e => setTestType(e.target.value)} className="border rounded p-2 text-sm bg-gray-50">
                        <option value="full_test">Full Test</option>
                        <option value="separated_test">Separated Test</option>
                     </select>
                     <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Duration (mins):</span>
                        <input type="number" value={totalDuration} onChange={e => setTotalDuration(Number(e.target.value))} className="w-20 border rounded p-1"/>
                     </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
                 <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-sm">
                    <Save size={18}/> {isLoading ? "Saving..." : "Save Test"}
                 </button>
                 <label className="cursor-pointer border border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-50 text-center transition">
                    <input type="file" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*"/>
                    <div className="flex flex-col items-center gap-1 text-gray-500 text-xs">
                        <ImageIcon size={20}/>
                        <span>{imageFile ? "Image Selected" : "Upload Cover"}</span>
                    </div>
                 </label>
            </div>
        </div>

        {/* PARTS LOOP */}
        {parts.map((part, pIdx) => (
            <div key={pIdx} className="bg-white rounded-xl shadow border-l-4 border-emerald-500 overflow-hidden">
                <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center">
                    <div className="flex gap-4 items-center flex-1">
                        <span className="font-bold text-emerald-800 whitespace-nowrap">PART {pIdx + 1}</span>
                        <input className="flex-1 bg-transparent border-b border-transparent focus:border-emerald-400 outline-none font-medium text-emerald-900" 
                            value={part.passageTitle} 
                            onChange={e => updatePart(pIdx, "passageTitle", e.target.value)} 
                            placeholder="Passage Title (e.g. Can Coral Reefs be Saved?)"
                        />
                    </div>
                    <button onClick={() => removePart(pIdx)} className="text-gray-400 hover:text-red-500 ml-4"><Trash2 size={18}/></button>
                </div>
                
                <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT: READING TEXT */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Type size={14}/> Passage Content</label>
                        <textarea className="w-full h-96 border border-gray-300 rounded-lg p-3 text-sm font-serif leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                            value={part.text}
                            onChange={e => updatePart(pIdx, "text", e.target.value)}
                            placeholder="Paste the full reading passage here..."
                        />
                    </div>

                    {/* RIGHT: SECTIONS & QUESTIONS */}
                    <div className="space-y-6 h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {part.sections.map((section, sIdx) => (
                            <div key={sIdx} className="border border-gray-200 rounded-lg bg-gray-50 p-4 relative">
                                <div className="absolute top-2 right-2">
                                     <button onClick={() => removeSection(pIdx, sIdx)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>

                                <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex gap-2">
                                        <select className="bg-white border border-gray-300 rounded p-1 text-sm font-semibold text-blue-700 flex-1"
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
                                        <input className="border border-gray-300 rounded p-1 text-xs w-24 text-center" value={section.sectionRange} onChange={e => updateSection(pIdx, sIdx, "sectionRange", e.target.value)} placeholder="Q 1-5"/>
                                    </div>
                                    <input className="w-full border border-gray-300 rounded p-2 text-sm" value={section.sectionTitle} onChange={e => updateSection(pIdx, sIdx, "sectionTitle", e.target.value)} placeholder="Section Title..."/>
                                    <input className="w-full border border-gray-300 rounded p-2 text-sm" value={section.instructions} onChange={e => updateSection(pIdx, sIdx, "instructions", e.target.value)} placeholder="Instructions..."/>
                                </div>

                                {/* --- SPECIAL UI BLOCKS --- */}
                                
                                {/* 1. Matching Headings */}
                                {section.questionType === 'matching_headings' && (
                                    <div className="mb-4">
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">List of Headings (One per line)</label>
                                        <textarea className="w-full border rounded p-2 text-sm h-24"
                                            placeholder="i. Introduction&#10;ii. History..."
                                            onChange={e => handleListUpdate(pIdx, sIdx, 'headings', e.target.value)}
                                            defaultValue={section.headings?.join('\n')}
                                        />
                                    </div>
                                )}

                                {/* 2. Matching Names */}
                                {section.questionType === 'matching_names' && (
                                    <div className="mb-4">
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">List of Names/Options (One per line)</label>
                                        <textarea className="w-full border rounded p-2 text-sm h-24"
                                            placeholder="A. David Attenborough&#10;B. Paul Pearce-Kelly..."
                                            onChange={e => handleListUpdate(pIdx, sIdx, 'matchingOptions', e.target.value)}
                                            defaultValue={section.matchingOptions?.join('\n')}
                                        />
                                    </div>
                                )}

                                {/* 3. Diagram Labeling */}
                                {section.questionType === 'diagram_labeling' && (
                                    <div className="mb-4 bg-blue-50 p-2 rounded border border-blue-100">
                                        <label className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1"><ImageIcon size={14}/> Diagram Image URL</label>
                                        <input className="w-full border border-blue-200 rounded p-2 text-sm"
                                            placeholder="/images/diagram1.jpg"
                                            value={section.diagramImageUrl || ""}
                                            onChange={e => updateSection(pIdx, sIdx, "diagramImageUrl", e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* 4. Table Completion */}
                                {section.questionType === 'table_completion' && (
                                    <div className="mb-4 overflow-x-auto bg-white p-2 rounded border">
                                        <label className="text-xs font-bold text-gray-500 mb-2 block flex gap-2">
                                            <Grid size={14}/> Table Structure
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <button onClick={() => handleTableStructure(pIdx, sIdx, 'col', 'add')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">+ Add Column</button>
                                            <button onClick={() => handleTableStructure(pIdx, sIdx, 'row', 'add')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">+ Add Row</button>
                                        </div>
                                        <table className="w-full text-xs border-collapse">
                                            <thead>
                                                <tr>
                                                    {section.table?.columns.map((col, cIdx) => (
                                                        <th key={cIdx} className="border p-1 bg-gray-100 min-w-[100px]">
                                                            <input className="bg-transparent w-full font-bold outline-none" value={col} onChange={e => handleTableStructure(pIdx, sIdx, 'col', 'update', cIdx, e.target.value)} />
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {section.table?.rows.map((row, rIdx) => (
                                                    <tr key={rIdx}>
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className="border p-1">
                                                                <input className="w-full outline-none" value={cell} onChange={e => handleTableCell(pIdx, sIdx, rIdx, cIdx, e.target.value)} placeholder="Text or __gap__"/>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* QUESTIONS LIST */}
                                <div className="space-y-4 pl-3 border-l-2 border-gray-300">
                                    {section.questions.map((q, qIdx) => (
                                        <div key={q.tempId} className="flex gap-2 items-start group">
                                            <div className="text-xs font-bold pt-2 w-6 text-gray-400">Q</div>
                                            <div className="flex-1 space-y-2">
                                                <input className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none" 
                                                    placeholder="Question text..."
                                                    value={q.question}
                                                    onChange={e => updateQuestion(pIdx, sIdx, qIdx, "question", e.target.value)}
                                                />
                                                
                                                {/* Logic Multiple Choice Options */}
                                                {section.questionType === 'multiple_choice' && (
                                                     <div className="grid grid-cols-1 gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                                                        {q.options?.map((opt, oIdx) => (
                                                            <div key={oIdx} className="flex items-center gap-2">
                                                                <span className="font-bold text-xs w-4">{String.fromCharCode(65+oIdx)}</span>
                                                                <input className="flex-1 border border-gray-300 rounded p-1 text-xs"
                                                                    value={opt}
                                                                    placeholder={`Option ${String.fromCharCode(65+oIdx)}`}
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
                                            <button onClick={() => removeQuestion(pIdx, sIdx, qIdx)} className="text-gray-300 hover:text-red-500 pt-2"><Trash2 size={16}/></button>
                                        </div>
                                    ))}
                                    <button onClick={() => addQuestion(pIdx, sIdx)} className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-2">
                                        <Plus size={14}/> Add Question
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <button onClick={() => addSection(pIdx)} className="w-full py-2 border border-dashed border-gray-400 text-gray-500 rounded hover:bg-gray-100 text-sm font-medium">
                            + Add New Section
                        </button>
                    </div>
                </div>
            </div>
        ))}

        <div className="text-center pt-6">
            <button onClick={addPart} className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2 mx-auto">
                <Plus size={20}/> Add New Passage
            </button>
        </div>

      </div>
    </div>
  );
}