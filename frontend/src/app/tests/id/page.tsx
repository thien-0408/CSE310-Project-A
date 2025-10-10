import ListeningTestComponent from "@/components/ListeningTestComponent";
import { ListeningData } from "@/types/listening"; 

// This function will fetch the specific test data based on the ID from the URL.
// In a real application, this would fetch from a database or a folder of JSON files.
async function getTestData(id: string): Promise<ListeningData | null> {
  
  if (id === "1") {
    // We import the specific JSON file for the test.
    const testData = await import("@/data/listeningJson/part1.json");
    // The '.default' is often needed when dynamically importing JSON in Next.js
    return testData.default as ListeningData;
  }
  
  // Return null if no test is found for the given ID
  return null;
}

// This is the main server component for the page.
export default async function DynamicTestPage({ params }: { params: { id: string } }) {
  // 1. Fetch the test data using the ID from the URL (e.g., "1")
  const testData = await getTestData(params.id);

  // 2. If no data is found for that ID, show a "not found" page.
  if (!testData) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Test not found!</h1>
        <p>Could not find a test with the ID: {params.id}</p>
      </div>
    );
  }

  // 3. If data is found, render your reusable component and pass the data to it.
  return (
    <div>
      {/* You can add a header or title here if you wish */}
      <ListeningTestComponent testData={testData} />
    </div>
  );
}