// ==========================================
// 1. Sub-Entities (Chi tiết nhỏ nhất)
// ==========================================

export interface ListeningAnswer {
  id: string;        // GUID
  questionId: string; // GUID
  answerText: string; // Nội dung đáp án đúng (VD: "time-management")
}

export interface ListeningOption {
  id: string;        // GUID
  questionId: string; // GUID
  key: string;       // "A", "B", "C"
  text: string;      // Nội dung lựa chọn (VD: "good future")
}

// ==========================================
// 2. Listening Question
// ==========================================

export interface ListeningQuestion {
  id: string;             // GUID
  questionNumber: number; // Số thứ tự hiển thị (1, 2, 3...)
  sectionId: string;      // GUID
  
  questionText: string;   // Nội dung câu hỏi
  
  // Các trường đặc thù cho Form Completion / Note Completion
  label?: string | null;  // Nhãn (VD: "Name:", "Address:")
  value?: string | null;  // Giá trị tĩnh (cho các dòng không phải input)
  isInput: boolean;       // Có phải là ô nhập liệu không?
  wordLimit?: string | null; // "ONE WORD ONLY"

  // Danh sách đáp án đúng (Backend trả về list)
  answers: ListeningAnswer[]; 
  
  // Danh sách lựa chọn (cho Multiple Choice)
  options: ListeningOption[]; 
}

// ==========================================
// 3. Listening Section
// ==========================================

export type ListeningQuestionType = 
  | 'multiple_choice'
  | 'form_completion'
  | 'note_completion'
  | 'table_completion'
  | 'sentence_completion'
  | 'short_answer'
  | 'map_labeling'
  | 'diagram_labeling'
  | 'matching'
  | 'multiple_answers' // Chọn 2 trong 5
  | string;

export interface ListeningSection {
  id: string;             // GUID
  sectionNumber: number;  // 1, 2...
  partId: string;         // GUID
  
  sectionRange: string;   // "Questions 1-5"
  sectionTitle: string;   // Tiêu đề section
  questionType: ListeningQuestionType;
  instructions: string;   // Hướng dẫn làm bài
  wordLimit?: string | null;
  maxAnswers?: number | null; // Cho dạng Multiple Answers (chọn 2, 3 đáp án)

  // Hình ảnh cho Map/Diagram Labeling
  mapImageUrl?: string | null; 

  questions: ListeningQuestion[];
}

// ==========================================
// 4. Listening Part (Tương ứng với Part 1, 2, 3, 4 trong IELTS)
// ==========================================

export interface ListeningPart {
  id: string;           // GUID
  testId: string;       // GUID
  partNumber: number;   // 1, 2, 3, 4
  
  partTitle: string;    // "Part 1"
  context: string;      // Mô tả ngữ cảnh (VD: "Conversation between...")
  questionRange: string;// "1-10"
  
  // Audio riêng cho từng Part (nếu có)
  partAudioUrl?: string | null; 
  
  sections: ListeningSection[];
}

// ==========================================
// 5. Root Entity: Listening Test
// ==========================================

export interface ListeningTestResponse {
  id: string;           // GUID
  title: string;        // "Cambridge IELTS 18 - Test 1"
  subTitle?: string | null;
  testType: string;     // "full_test" | "practice"
  skill: string;        // "listening"
  
  audioDuration: number; // Phút hoặc Giây
  questionRange: string; // "1-40"
  
  imageUrl?: string | null; // Ảnh bìa
  audioUrl?: string | null; // Audio tổng (Full Test)
  
  parts: ListeningPart[];
}

// ==========================================
// 6. User Interaction Types (Cho Frontend Logic)
// ==========================================

export interface UserAnswer {
  questionId: string; // GUID
  answer: unknown;    // string | string[] (cho multiple answers)
}

export interface ScoreResult {
  totalScore: number;
  totalQuestions: number;
  accuracy: number;
  details: {
    questionId: number; // Số thứ tự (1, 2, 3...)
    questionText?: string;
    userAnswer: unknown;
    correctAnswer: string | string[];
    isCorrect: boolean;
  }[];
}