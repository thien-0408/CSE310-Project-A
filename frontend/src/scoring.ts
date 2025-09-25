export function scoreAnswers(userAnswers: Record<number, string | string[]>, correctAnswers: Record<number, string | string[]>) {
  let total = 0;
  let correct = 0;

  for (const id in correctAnswers) {
    total++;
    if (JSON.stringify(userAnswers[id]) === JSON.stringify(correctAnswers[id])) {
      correct++;
    }
  }

  return {
    total,
    correct,
    score: (correct / total) * 100,
  };
}
