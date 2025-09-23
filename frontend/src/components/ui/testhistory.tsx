"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


// Sample test history data
const testHistoryData = [
  {
    id: 1,
    test: "Academic Mock 1",
    date: "2024-05-10",
    score: "7.0",
    status: "Completed",
    modules: { listening: 7.5, reading: 7.0, writing: 6.5, speaking: 7.0 }
  },
  {
    id: 2,
    test: "General Mock 1",
    date: "2024-05-01",
    score: "6.5",
    status: "Completed",
    modules: { listening: 7.0, reading: 6.5, writing: 6.0, speaking: 6.5 }
  },
  {
    id: 3,
    test: "Academic Mock 2",
    date: "2024-04-20",
    score: "6.8",
    status: "Completed",
    modules: { listening: 7.0, reading: 6.5, writing: 6.5, speaking: 7.0 }
  },
  {
    id: 4,
    test: "Reading Practice Set",
    date: "2024-04-15",
    score: "N/A",
    status: "Ongoing",
    modules: { listening: null, reading: 7.5, writing: null, speaking: null }
  },
  {
    id: 5,
    test: "Speaking Mock",
    date: "2024-04-05",
    score: "6.0",
    status: "Completed",
    modules: { listening: null, reading: null, writing: null, speaking: 6.0 }
  },
];

export default function TestHistorySection() {
  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
    } else if (status === "Ongoing") {
      return <Badge variant="outline" className="text-gray-600 border-gray-400">Ongoing</Badge>;
    } else {
      return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      {/* Test History Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            

            {/* Test History Table */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">Recent Tests</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-semibold text-gray-700">Test</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Score</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testHistoryData.map((test) => (
                      <TableRow key={test.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          {test.test}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(test.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            test.score === "N/A" ? "text-gray-400" : "text-gray-900"
                          }`}>
                            {test.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(test.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              View Details
                            </Button>
                            {test.status === "Ongoing" && (
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                Continue
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </section>

      
      
    </>
  );
}
