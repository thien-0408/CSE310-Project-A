export interface TestHistoryItem {
  testId: string;
  accuracy: number;
  isCompleted: boolean;
  skill: string;
  takenDate: string;
  finishDate: string;
  title: string;
}

export interface MilestoneResponse {
  id: string;
  date: string;
  eventTitle: string;
  eventDetail: string;
  userId: string;
}
export interface DailyWord {
  id: string;
  word: string;
  phonetic: string;
  type: string; 
  definition: string;
  example: string;
}
export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: "Grammar" | "Vocabulary" | "Exam Tip";
}