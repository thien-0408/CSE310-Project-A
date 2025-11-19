export interface Statement {
  statementId: number;
  text: string;
}
export interface TableData {
  columns: string[];
  rows: string[][]; 
}
export interface Blank {
  index: number; 
  answer: string;
}

export interface ReadingQuestion {
  id: number;
  question: string; 
  answer: unknown; 
  wordLimit?: string;
  options?: string[];
  answerType?: "single"; 
  paragraphs?: string[];
  range?: string; 
  questionRange?: string;
  diagram?: string[]; 
  text?: string; 
  blanks?: Blank[]; 
  statements?: Statement[];
}


export interface ReadingSection {
  sectionId: number;
  sectionRange: string; 
  sectionTitle: string; 
  questionType: string; 
  instructions?: string;
  wordLimit?: string;
  text?:string; 
  table?: TableData; 
  headings?: string[]; 
  options?: string[];
  questions: ReadingQuestion[];
}

export interface ReadingData {
  id: number;
  partNumber: number; 
  // title: string;
  // passageContent: string; 
  sections: ReadingSection[];
  testDuration: number;
  passageTitle: string;
  questionRange: string;
  
}