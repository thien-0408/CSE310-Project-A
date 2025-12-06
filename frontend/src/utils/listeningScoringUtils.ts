import { ListeningPart, UserAnswer } from "@/types/listening";

// Định nghĩa Type cho kết quả chấm điểm
export interface ScoreResultDetail {
  sectionId: string;
  questionId: string;
  questionNumber: number;
  questionType: string;
  questionText: string;
  userAnswer: unknown;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
}

export interface CalculationResult {
  totalScore: number;
  totalQuestions: number;
  details: ScoreResultDetail[];
  resultsBySection: Record<string, ScoreResultDetail[]>;
}

const normalizeText = (text: unknown): string => {
  if (typeof text !== "string") return "";
  return text.toLowerCase().trim().replace(/\s+/g, " ");
};

// Hàm tính điểm chính (Pure Function)
export const calculateListeningScore = (
  listeningData: ListeningPart,
  userAnswers: UserAnswer[]
): CalculationResult => {
  if (!listeningData || !userAnswers) {
    return { totalScore: 0, totalQuestions: 0, details: [], resultsBySection: {} };
  }

  const userAnswersMap = new Map(
    userAnswers.map((u) => [u.questionId, u.answer])
  );

  let totalScore = 0;
  const details: ScoreResultDetail[] = [];

  if (listeningData?.sections) {
    listeningData.sections.forEach((section) => {
      if (section.questions) {
        section.questions.forEach((question) => {
          const userAnsRaw = userAnswersMap.get(question.id);
          
          let correctAnswersList: string[] = [];
          if (question.answers && question.answers.length > 0) {
            correctAnswersList = question.answers.map((a) => a.answerText);
          }

          let isCorrect = false;
          let points = 0;

          if (typeof userAnsRaw === "string") {
            const normalizedUser = normalizeText(userAnsRaw);
            isCorrect = correctAnswersList.some(
              (ans) => normalizeText(ans) === normalizedUser
            );
            if (normalizedUser === "") isCorrect = false;
          } else if (Array.isArray(userAnsRaw)) {
            const userArray = userAnsRaw.map(String).sort();
            const validArray = correctAnswersList.map(String).sort();
            if (userArray.length > 0) {
              isCorrect =
                JSON.stringify(userArray.map(normalizeText)) ===
                JSON.stringify(validArray.map(normalizeText));
            }
          }

          if (isCorrect) {
            points = 1;
            totalScore += 1;
          }

          details.push({
            sectionId: section.id,
            questionId: question.id,
            questionNumber: question.questionNumber,
            questionType: section.questionType,
            questionText: question.questionText || section.sectionTitle,
            userAnswer: userAnsRaw,
            correctAnswer: correctAnswersList.join(" / "),
            isCorrect,
            points,
          });
        });
      }
    });
  }

  // Group by Section
  const resultsBySection = details.reduce((acc, result) => {
    if (!acc[result.sectionId]) {
      acc[result.sectionId] = [];
    }
    acc[result.sectionId].push(result);
    return acc;
  }, {} as Record<string, ScoreResultDetail[]>);

  return {
    totalScore,
    totalQuestions: details.length,
    details,
    resultsBySection,
  };
};