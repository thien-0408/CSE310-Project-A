// types/reading.ts

// ==========================================
// 1. Sub-Entities (Chi tiết nhỏ nhất)
// ==========================================

export interface QuestionAnswer {
  id: string; // Guid
  index: number;
  questionId: string; // Guid
  content: string; // Nội dung đáp án đúng (VD: "True", "A", "strategic shifts")
}

export interface QuestionOption {
  id: string; // Guid
  index: number; // 0=A, 1=B, 2=C...
  questionId: string; // Guid
  text: string; // Nội dung lựa chọn (VD: "They used different motor skills...")
}

export interface SectionOption {
  id: number; // Lưu ý: Entity gốc đang để là int
  sectionId: string; // Guid
  text: string; // VD: "i. Experiments on typing skills" (Heading) hoặc "A. David Attenborough"
  key?: string | null; // VD: "i", "ii", "A", "B"
}

// ==========================================
// 2. Reading Question
// ==========================================

export interface ReadingQuestion {
  id: string; // Guid
  questionNumber: number; 
  sectionId: string; // Guid
  questionText: string; 
  diagramLabelsJson?: string | null; 
  answers: QuestionAnswer[]; 
  options: QuestionOption[]; 
}

// ==========================================
// 3. Reading Section
// ==========================================

export type ReadingQuestionType = 
  | 'multiple_choice'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_headings'
  | 'matching_names'
  | 'table_completion'
  | 'summary_completion'
  | 'sentence_completion'
  | 'short_answer'
  | 'diagram_labeling'
  | 'gap_filling'
  | string; // Fallback 

export interface ReadingSection {
  sectionId: string; // Guid
  sectionNumber: number; // 1, 2...
  partId: string; // Guid
  
  sectionRange: string; // "Questions 1-5"
  sectionTitle: string; // "Multiple Choice"
  questionType: ReadingQuestionType;
  instructions: string; // "Choose the correct letter..."
  wordLimit?: string | null; 
  gapFillText?: string | null; 
  tableJson?: string | null; 
  optionRange?: string | null;
  questions: ReadingQuestion[];
  sectionOptions: SectionOption[]; 
}

// ==========================================
// 4. Reading Part (Passage)
// ==========================================

export interface ReadingPart {
  partId: string; 
  testId: string; 
  partNumber: number; 
  partTitle: string;
  passageTitle: string; 
  skill: string; 
  thumbnailUrl?: string | null;
  testDuration: number;
  questionRange?: string | null; 
  text: string; 
  sections: ReadingSection[];
}

// ==========================================
// 5. Root Entity: Reading Test
// ==========================================

export interface ReadingTestResponse {
  testId: string; // Guid
  title: string; // "Cambridge IELTS 18 - Test 1"
  testType: string; // "full_test" | "practice"
  skill: string; // "reading"
  totalDuration: number; // Seconds
  questionRange?: string | null; // "1-40"
  imageUrl?: string | null;
  subtitle?: string | null; 
  button?: string | null; // "Try Now"
  parts: ReadingPart[];
  
}

export interface ParsedTableData {
  columns: string[];
  rows: string[][];
}
export type ReadingData = ReadingPart;