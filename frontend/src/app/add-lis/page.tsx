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
} from "lucide-react";
import { useToast } from "@/components/ui/ToastNotification";

// --- TYPES (Mapping DTO Backend) ---

type ListeningOption = {
  key: string;
  text: string;
};

type ListeningAnswer = {
  answerText: string;
};

type ListeningQuestion = {
  tempId: number; 
  questionNumber: number;
  questionText: string;
  label?: string;
  value?: string;
  isInput?: boolean;
  wordLimit?: string;
  options: ListeningOption[]; 
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
  mapImageFile?: File | null;
  mapImageUrl?: string; 
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

  // --- HANDLERS: PART ---
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

  // --- HANDLERS: SECTION ---
  const addSection = (partIndex: number) => {
    const newParts = [...parts];
    newParts[partIndex].sections.push({
      sectionNumber: newParts[partIndex].sections.length + 1,
      sectionTitle: "Questions 1-5",
      sectionRange: "",
      questionType: "form_completion", // default
      instructions: "Write ONE WORD AND/OR A NUMBER",
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

    // Auto-init options if switching to MCQ
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

  const removeSection = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    newParts[pIdx].sections = newParts[pIdx].sections.filter(
      (_, i) => i !== sIdx
    );
    setParts(newParts);
  };

  // --- HANDLERS: QUESTION ---
  const addQuestion = (pIdx: number, sIdx: number) => {
    const newParts = [...parts];
    const section = newParts[pIdx].sections[sIdx];
    const qNum = Math.floor(Math.random() * 10000); // Temp ID

    // Init options based on type
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
      questionNumber: 0, // Should be auto-calculated on submit
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

  // --- SUBMIT ---
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

      // 1. Clean Data for JSON (Remove File objects to avoid circular error)
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
          Questions: s.questions.map((q) => ({
            QuestionNumber: globalQCount++, // Auto number 1-40
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

      // 2. Append Part Audios (Strict Order)
      // Backend logic uses index 'i' to map PartsData[i] with PartAudioFiles[i].
      // We MUST append a value for every part. If no file, we append an empty blob to maintain index alignment.
      parts.forEach((part) => {
        if (part.audioFile) {
          formData.append("PartAudioFiles", part.audioFile);
        } else {
          // Append empty blob if no audio, to keep the list index in sync with backend loop
          // Note: Check backend logic if it handles empty files correctly (Length > 0 check)
          formData.append("PartAudioFiles", new Blob(), "empty.mp3");
        }
      });

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
    } catch (e) {
      console.error(e);
      showToast("Error occured", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 mt-5">
      <div className="mx-auto space-y-8">
        <ToastComponent></ToastComponent>
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6 text-blue-700">
            <Music className="w-8 h-8" /> Create Listening Test
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Test Title
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Cambridge IELTS 18 Test 1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Subtitle
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="Form completion, Multiple choice..."
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600">
                    Range
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    value={questionRange}
                    onChange={(e) => setQuestionRange(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={audioDuration}
                    onChange={(e) => setAudioDuration(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded border border-dashed border-gray-300">
              <div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
                    <ImageIcon size={16} /> Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTestImage(e.target.files?.[0] || null)}
                    className="text-sm w-full"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
                    <FileAudio size={16} /> Main Audio (Full Test)
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setTestAudio(e.target.files?.[0] || null)}
                    className="text-sm w-full"
                  />
                </div>
              </div>
            </div>
            <div className="max-w-2xl">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Save size={18} /> {isLoading ? "Saving..." : "Save Test"}
              </button>
            </div>
          </div>
        </div>

        {/* PARTS LOOP */}
        {parts.map((part, pIdx) => (
          <div
            key={pIdx}
            className="bg-white rounded-xl shadow-md border-l-4 overflow-hidden"
          >
            {/* Part Header */}
            <div className="bg-purple-50 p-4 border-b border-purple-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-800 whitespace-nowrap">
                    PART {pIdx + 1}
                  </span>
                  <input
                    className="w-full bg-white border border-purple-200 rounded px-2 py-1 text-sm focus:border-purple-500 outline-none"
                    value={part.partTitle}
                    onChange={(e) =>
                      updatePart(pIdx, "partTitle", e.target.value)
                    }
                    placeholder="Part Title"
                  />
                </div>
                <input
                  className="bg-white border border-purple-200 rounded px-2 py-1 text-sm outline-none"
                  value={part.context}
                  onChange={(e) => updatePart(pIdx, "context", e.target.value)}
                  placeholder="Context description..."
                />

                {/* Part Audio Upload */}
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-purple-200">
                  <FileAudio size={14} className="text-purple-600" />
                  <input
                    type="file"
                    accept="audio/*"
                    className="text-xs w-full"
                    onChange={(e) =>
                      handlePartAudioChange(pIdx, e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => removePart(pIdx)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Sections */}
            <div className="p-4 space-y-6 bg-slate-50">
              {part.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="border border-gray-300 bg-white rounded-lg p-4 relative shadow-sm"
                >
                  <button
                    onClick={() => removeSection(pIdx, sIdx)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Section Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        Question Type
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded p-1.5 text-sm font-semibold text-blue-700"
                        value={section.questionType}
                        onChange={(e) =>
                          updateSection(
                            pIdx,
                            sIdx,
                            "questionType",
                            e.target.value
                          )
                        }
                      >
                        <option value="form_completion">Form Completion</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="map_labeling">Map Labeling</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="matching">Matching</option>
                        <option value="sentence_completion">
                          Sentence Completion
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        Range
                      </label>
                      <input
                        className="w-full border rounded p-1.5 text-sm"
                        value={section.sectionRange}
                        onChange={(e) =>
                          updateSection(
                            pIdx,
                            sIdx,
                            "sectionRange",
                            e.target.value
                          )
                        }
                        placeholder="Q 1-5"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        Instructions
                      </label>
                      <input
                        className="w-full border rounded p-1.5 text-sm"
                        value={section.instructions}
                        onChange={(e) =>
                          updateSection(
                            pIdx,
                            sIdx,
                            "instructions",
                            e.target.value
                          )
                        }
                        placeholder="No more than two words..."
                      />
                    </div>
                  </div>

                  {/* Map Image Upload (Specific for Map Labeling) */}
                  {section.questionType === "map_labeling" && (
                    <div className="mb-4 bg-yellow-50 p-3 rounded border border-yellow-200 flex items-center gap-4">
                      <Map className="text-yellow-600" size={20} />
                      <div>
                        <label className="text-xs font-bold text-yellow-800 block mb-1">
                          Upload Map Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="text-xs block w-full text-slate-500"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                          *Feature coming soon (Backend mapping needed)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  <div className="space-y-3 pl-2 border-l-2 border-gray-200">
                    {section.questions.map((q, qIdx) => (
                      <div
                        key={q.tempId}
                        className="flex gap-3 items-start group p-2 rounded hover:bg-gray-50"
                      >
                        <div className="mt-2 text-xs font-bold text-gray-400 w-6">
                          Q{qIdx + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          {/* Question Text */}
                          <input
                            className="w-full border-b border-gray-300 bg-transparent focus:border-blue-500 outline-none text-sm py-1"
                            placeholder="Question text..."
                            value={q.questionText}
                            onChange={(e) =>
                              updateQuestion(
                                pIdx,
                                sIdx,
                                qIdx,
                                "questionText",
                                e.target.value
                              )
                            }
                          />

                          {/* Correct Answer */}
                          <div className="flex items-center gap-2">
                            <CheckCircle2
                              size={14}
                              className="text-green-600"
                            />
                            <input
                              className="flex-1 bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-800"
                              placeholder="Correct Answer"
                              value={q.answers[0]?.answerText || ""}
                              onChange={(e) =>
                                updateAnswer(pIdx, sIdx, qIdx, e.target.value)
                              }
                            />
                          </div>

                          {/* MCQ Options */}
                          {section.questionType === "multiple_choice" && (
                            <div className="grid grid-cols-1 gap-1 mt-1 pl-4">
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="font-bold text-xs w-4">
                                    {opt.key}
                                  </span>
                                  <input
                                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs"
                                    value={opt.text}
                                    placeholder={`Option ${opt.key}`}
                                    onChange={(e) =>
                                      updateOption(
                                        pIdx,
                                        sIdx,
                                        qIdx,
                                        oIdx,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeQuestion(pIdx, sIdx, qIdx)}
                          className="text-gray-300 hover:text-red-500 pt-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addQuestion(pIdx, sIdx)}
                      className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-2 hover:underline"
                    >
                      <Plus size={14} /> Add Question
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addSection(pIdx)}
                className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:border-purple-400 hover:text-purple-600 font-medium transition flex justify-center items-center gap-2"
              >
                <Plus size={16} /> Add Section to Part {pIdx + 1}
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center gap-4 pt-6">
          <button
            onClick={addPart}
            className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-black shadow-lg flex items-center gap-2 transition transform hover:scale-105"
          >
            <Plus size={20} /> Add New Part
          </button>
        </div>
      </div>
    </div>
  );
}
