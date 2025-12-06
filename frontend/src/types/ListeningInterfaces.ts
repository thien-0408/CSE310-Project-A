// 1. Option (Dùng cho câu hỏi trắc nghiệm A, B, C...)
export interface ListeningOption {
  id: string;
  key: string;   // "A", "B", "C", "D"
  text: string;  // Nội dung lựa chọn
}

// 2. Answer (Đáp án đúng - Server trả về để chấm điểm hoặc hiển thị kết quả)
export interface ListeningAnswer {
  id: string;
  answerText: string;
  explanation?: string | null; // Giải thích (nếu có)
}

// 3. Question (Câu hỏi chi tiết)
export interface ListeningQuestion {
  id: string;
  questionNumber: number; // Số thứ tự câu hỏi (1, 2, 3...)
  questionText: string;   // Nội dung câu hỏi hoặc nhãn (Label)
  label?: string | null;  // Nhãn hiển thị bổ sung (ví dụ cho Form Completion)
  value?: string | null;  // Giá trị điền sẵn (nếu isInput = false)
  isInput: boolean;       // true = ô trống để điền, false = text tĩnh
  wordLimit?: string | null; // Giới hạn từ riêng cho câu này (nếu override Section)
  
  options?: ListeningOption[]; // Danh sách lựa chọn (nếu là trắc nghiệm)
  answers?: ListeningAnswer[]; // Danh sách đáp án đúng (có thể null nếu chưa submit)
}

// 4. Section (Nhóm câu hỏi - Ví dụ: Questions 1-5)
export interface ListeningSection {
  id: string;
  sectionNumber: number;
  sectionRange: string; // "Questions 1-5"
  sectionTitle: string; // "PERSONAL DETAILS"
  questionType: 
    | "form_completion" 
    | "multiple_choice" 
    | "note_completion" 
    | "table_completion"
    | "sentence_completion"
    | "short_answer"
    | "matching_information"
    | "pick_from_a_list"
    | "map_labeling"
    | "diagram_labeling"
    | string; // Cho phép string để mở rộng sau này
  
  instructions: string;   // "Write NO MORE THAN THREE WORDS..."
  wordLimit?: string | null; // "NO MORE THAN THREE WORDS"
  mapImageUrl?: string | null; // URL ảnh Map/Diagram (nếu có)
  maxAnswers?: number | null;  // Số lượng đáp án tối đa (cho dạng Pick from list)
  
  questions: ListeningQuestion[];
}

// 5. Part (Phần thi - Part 1, Part 2...)
export interface ListeningPart {
  id: string;
  partNumber: number;
  partTitle: string;
  context?: string | null; // Bối cảnh (A student talking to...)
  questionRange: string;   // "1-10"
  partAudioUrl?: string | null; // Audio riêng của Part
  
  sections: ListeningSection[];
}

// 6. ROOT: Listening Test (Cấu trúc trả về từ API /get-test/{id})
export interface ListeningTest {
  id: string;
  title: string;          // "Cambridge IELTS 18 - Test 1"
  subTitle?: string | null;
  testType: string;       // "full_test"
  skill: string;          // "listening"
  
  audioUrl?: string | null; // Audio gộp cả bài (nếu có)
  imageUrl?: string | null; // Ảnh bìa
  
  questionRange: string;  // "1-40"
  audioDuration: number;  // Phút (30)
  createdAt: string;      // Date string ISO
  
  parts: ListeningPart[];
}