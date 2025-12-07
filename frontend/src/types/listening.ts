
export interface ListeningAnswer {
  id: string;        
  questionId: string; 
  answerText: string; 
}

export interface ListeningOption {
  id: string;       
  questionId: string; 
  key: string;     
  text: string;     
}



export interface ListeningQuestion {
  id: string;             
  questionNumber: number; 
  sectionId: string;    
  
  questionText: string;  
    label?: string | null;  
  value?: string | null;  
  isInput: boolean;       
  wordLimit?: string | null; 
  answers: ListeningAnswer[]; 
  options: ListeningOption[]; 
}


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
  | 'multiple_answers'
  | string;

export interface ListeningSection {
  id: string;             
  sectionNumber: number;  
  partId: string;         
  sectionRange: string;   
  sectionTitle: string;   
  questionType: ListeningQuestionType;
  instructions: string;   
  wordLimit?: string | null;
  maxAnswers?: number | null; 
  mapImageUrl?: string | null; 
  questions: ListeningQuestion[];
}

export interface ListeningPart {
  id: string;           
  testId: string;     
  partNumber: number;  
  
  partTitle: string;    
  context: string;     
  questionRange: string;
  partAudioUrl?: string | null; 
  
  sections: ListeningSection[];
}


export interface ListeningTestResponse {
  id: string;       
  title: string;       
  subTitle?: string | null;
  testType: string;    
  skill: string;        
  
  audioDuration: number; 
  questionRange: string; 
  
  imageUrl?: string | null; 
  audioUrl?: string | null; 
  
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