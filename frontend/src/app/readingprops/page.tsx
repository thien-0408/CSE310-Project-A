import ReadingTestComponent from "@/components/ReadingTestComponent";
import data from "@/data/readingquestion.json";

export default function Page() {
  const formattedData = {
    ...data,
    questions: data.questions.map(q => ({
      ...q,
      answer: q.answer.toString()
    }))
  };
  
  return <ReadingTestComponent data={formattedData} />;
}
