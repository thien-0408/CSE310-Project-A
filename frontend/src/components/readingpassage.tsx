"use client";

interface ReadingPassageProps {
  id: number;
  title: string;
  text: string;
}

export default function ReadingPassage({
  id,
  title,
  text,
}: ReadingPassageProps) {
  return (
    <>
      <div >
        <h1 className="text-2xl font-bold">Reading Passage {id}</h1>
        <h2 className="mb-4 text-lg font-bold text-blue-600">{title}</h2>
        {text.split("\n").map((line, index) => (
        <p  key={index} className="mb-2 leading-relaxed text-gray-800 font-medium">
          {line}
        </p>
      ))}
      </div>
    </>
  );
}
