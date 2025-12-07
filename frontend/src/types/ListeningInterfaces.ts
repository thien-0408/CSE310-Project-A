export interface ListeningOption {
  id: string;
  key: string;  
  text: string; 
}

export interface ListeningAnswer {
  id: string;
  answerText: string;
  explanation?: string | null; 
}

export interface ListeningQuestion {
  id: string;
  questionNumber: number; 
  questionText: string;   
  label?: string | null;  
  value?: string | null; 
  isInput: boolean;       
  wordLimit?: string | null; 
  
  options?: ListeningOption[]; 
  answers?: ListeningAnswer[]; 
}

export interface ListeningSection {
  id: string;
  sectionNumber: number;
  sectionRange: string; 
  sectionTitle: string; 
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
    | string;
  
  instructions: string;   
  wordLimit?: string | null; 
  mapImageUrl?: string | null; 
  maxAnswers?: number | null;  
  
  questions: ListeningQuestion[];
}
export interface ListeningPart {
  id: string;
  partNumber: number;
  partTitle: string;
  context?: string | null; 
  questionRange: string;   
  partAudioUrl?: string | null; 
  sections: ListeningSection[];
}

export interface ListeningTest {
  id: string;
  title: string;         
  subTitle?: string | null;
  testType: string;      
  skill: string;        
  
  audioUrl?: string | null; 
  imageUrl?: string | null; 
  
  questionRange: string;  
  audioDuration: number;  
  createdAt: string; 
  
  parts: ListeningPart[];
}