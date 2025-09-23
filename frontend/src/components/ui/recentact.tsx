'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaBookOpen, FaRegClipboard, FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi";

const activityData = [
  {
    icon: <FaBookOpen className="h-6 w-6 text-gray-400 mr-2" />,
    title: "Completed Test",
    desc: "IELTS Mock Test 3",
    time: "2 hours ago",
    badge: <Badge className="bg-gray-200 text-gray-700 font-medium hover:text-white">Band 7.0</Badge>,
  },
  {
    icon: <FaRegClipboard className="h-6 w-6 text-gray-400 mr-2" />,
    title: "Reviewed Feedback",
    desc: "Writing Task 1 Essay",
    time: "3 days ago",
    badge: null,
  },
  {
    icon: <HiOutlineAcademicCap className="h-6 w-6 text-gray-400 mr-2" />,
    title: "New Module",
    desc: "Speaking Fluency Course",
    time: "Yesterday",
    badge: null,
  },
  {
    icon: <FaRegCheckCircle className="h-6 w-6 text-gray-400 mr-2" />,
    title: "Completed Practice",
    desc: "Reading Section - Academic Passage 2",
    time: "Last Week",
    badge: null,
  },
];

export default function RecentAcivity() {
  return (
    <div className="bg-white flex flex-col tracking-tighter">
      <section className="container mx-auto px-4">
        <Card className="rounded-xl shadow-sm border-none">
          <CardContent className="p-0">
            {activityData.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center">
                    {item.icon}
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-gray-600 text-sm">{item.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 text-sm font-medium">{item.time}</span>
                    {item.badge}
                  </div>
                </div>
                {/* Only render Separator if not the last activity */}
                {idx < activityData.length - 1 && (
                  <Separator className="" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
