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