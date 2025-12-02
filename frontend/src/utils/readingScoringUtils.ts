import { ReadingSection } from "@/types/ReadingInterfaces";
export interface UserAnswerItem {
  questionId: string;
  answer: unknown;
}

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
  userAnswersInput: UserAnswerItem[] 
): ScoreResult => {
  
 
  const userAnswers: Record<string, unknown> = {};
  if (Array.isArray(userAnswersInput)) {
    userAnswersInput.forEach((item) => {
      userAnswers[item.questionId] = item.answer;
    });
  }

  const allQuestions = sections.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      sectionId: section.sectionId,
      questionType: section.questionType,
    }))
  );

  let totalScore = 0;

  const details = allQuestions.map((question) => {
    let userAnsRaw = userAnswers[question.id]; 

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

    if (typeof userAnsRaw === "string") {
      const normalizedUser = normalizeText(userAnsRaw);
      isCorrect = validAnswers.some(
        (validAns) => normalizeText(validAns) === normalizedUser
      );
      if (normalizedUser === "") isCorrect = false;
    }
    else if (Array.isArray(userAnsRaw)) {
      const rawArray = userAnsRaw as unknown[];
      
      if (rawArray.length > 0) {
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
  const accuracy = Math.round(totalScore/totalQuestions*100);

  return {
    totalScore,
    totalQuestions,
    accuracy,
    details,
  };
};