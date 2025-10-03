export interface FormField {
  id: number;
  label: string;
  answer: string;
  wordLimit?: string;
  isInput: boolean;
  audioTimestamp?: string;
}

export interface Question {
  id: number;
  question?: string;
  text?: string;
  options?: string[];
  answer: string | number | number[]; 
  wordLimit?: string;
  audioTimestamp?: string;
  maxAnswers?: number; 
}

export interface Section {
  sectionId: number;
  sectionTitle: string;
  questionType: string;
  instruction?: string;
  wordLimit?: string;
  maxAnswers?: number;
  formFields?: FormField[];
  questions?: Question[];
}

export interface ListeningData {
  id: number;
  partNumber: number;
  partTitle: string;
  audioUrl: string;
  audioDuration: number;
  context: string;
  instructions: string;
  wordLimit?: string;
  questionRange: string;
  sections: Section[];
}

export interface UserAnswer {
  sectionId: number;
  questionId: number;
  answer: unknown;
}

export interface ScoreResult {
  sectionId: number;
  questionId: number;
  isCorrect: boolean;
  userAnswer: unknown;
  correctAnswer: unknown;
  points: number;
  questionType: string;
  questionText?: string;
}