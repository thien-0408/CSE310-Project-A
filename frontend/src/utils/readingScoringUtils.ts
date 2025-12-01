// utils/readingScoringUtils.ts
import { ReadingSection } from "@/types/ReadingInterfaces";

// 1. Định nghĩa kiểu dữ liệu cho từng câu trả lời trong mảng
export interface UserAnswerItem {
  questionId: string;
  answer: unknown;
}

// Helper chuẩn hóa text
export const normalizeText = (text: unknown): string => {
  if (typeof text !== "string") return "";
  return text.toLowerCase().trim().replace(/\s+/g, " ");
};

export interface ScoreResult {
  totalScore: number;
  totalQuestions: number;
  accuracy: number;
  details: unknown[];
}

export const calculateReadingScore = (
  sections: ReadingSection[],
  userAnswersInput: UserAnswerItem[] // 👈 SỬA: Nhận vào Mảng (Array) thay vì Record
): ScoreResult => {
  
  // 2. Chuyển đổi Mảng (Array) sang Object (Map) để dễ tra cứu theo ID
  // Từ: [{questionId: "abc", answer: "True"}, ...] 
  // Thành: { "abc": "True", ... }
  const userAnswers: Record<string, unknown> = {};
  if (Array.isArray(userAnswersInput)) {
    userAnswersInput.forEach((item) => {
      userAnswers[item.questionId] = item.answer;
    });
  }

  // 3. Phẳng hóa danh sách câu hỏi (Flatten)
  const allQuestions = sections.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      sectionId: section.sectionId,
      questionType: section.questionType,
    }))
  );

  let totalScore = 0;

  // 4. Tính điểm chi tiết
  const details = allQuestions.map((question) => {
    let userAnsRaw = userAnswers[question.id]; // Tra cứu từ Object đã convert

    // --- LOGIC DỊCH GUID -> TEXT (Quan trọng cho trắc nghiệm) ---
    if (
      typeof userAnsRaw === "string" &&
      question.options &&
      question.options.length > 0
    ) {
      const matchedOption = question.options.find(
        (opt) => opt.id === userAnsRaw
      );
      if (matchedOption) userAnsRaw = matchedOption.text;
    }
    // -----------------------------------------------------------

    const correctAnswersList = question.answers || [];
    const validAnswers = correctAnswersList.map((a) => a.content);
    let isCorrect = false;

    // Logic so sánh (String)
    if (typeof userAnsRaw === "string") {
      const normalizedUser = normalizeText(userAnsRaw);
      isCorrect = validAnswers.some(
        (validAns) => normalizeText(validAns) === normalizedUser
      );
      if (normalizedUser === "") isCorrect = false;
    }
    // Logic so sánh (Array)
    else if (Array.isArray(userAnsRaw)) {
      // Ép kiểu an toàn sang mảng
      const rawArray = userAnsRaw as unknown[];
      
      if (rawArray.length > 0) {
        // Parse to string và sort để so sánh không quan trọng thứ tự
        const userArrayString = rawArray.map(String);
        
        const sortedUser = JSON.stringify(
          userArrayString.map(normalizeText).sort()
        );
        const sortedValid = JSON.stringify(
          validAnswers.map(normalizeText).sort()
        );
        isCorrect = sortedUser === sortedValid;
      }
    }

    if (isCorrect) totalScore += 1;

    return {
      questionId: question.id,
      isCorrect,
      userAnswer: userAnsRaw,
      correctAnswer: validAnswers,
    };
  });

  const totalQuestions = allQuestions.length;
  // Accuracy ở đây là tổng điểm số câu đúng
  const accuracy = totalScore;

  return {
    totalScore,
    totalQuestions,
    accuracy,
    details,
  };
};