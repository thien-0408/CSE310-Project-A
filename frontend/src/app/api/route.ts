import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const GROQ_API_KEY = "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";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const question = formData.get("question") as string;

    // 1. Chuyển audio thành Text (Whisper trên Groq)
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
    });

    // 2. Chấm điểm bài nói (Llama 3 trên Groq)
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `You are an IELTS Speaking examiner. Analyze the transcript for the question: "${question}". 
          Return a JSON with scores (0-9) for: argumentation, academic_register, complexity, coherence and a short feedback.`,
        },
        { role: "user", content: transcription.text },
      ],
      response_format: { type: "json_object" },
    });

    return NextResponse.json({
      transcript: transcription.text,
      analysis: JSON.parse(completion.choices[0].message.content || "{}"),
    });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xử lý AI" }, { status: 500 });
  }
}
