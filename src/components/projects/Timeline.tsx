"use client";

import { Calendar, Circle } from "lucide-react";

type TimelineEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "completed" | "in_progress" | "upcoming";
  type: "milestone" | "task" | "payment" | "document";
};

const MOCK_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    title: "Project Kickoff",
    description: "Initial meeting with all stakeholders",
    date: "2024-01-15",
    status: "completed",
    type: "milestone",
  },
  {
    id: 2,
    title: "Foundation Work Begins",
    description: "Start of foundation laying process",
    date: "2024-02-01",
    status: "in_progress",
    type: "task",
  },
  {
    id: 3,
    title: "First Payment Milestone",
    description: "30% of total project cost",
    date: "2024-02-15",
    status: "upcoming",
    type: "payment",
  },
];

export default function Timeline({ projectId }: { projectId: string }) {
  return (
    <div className="relative">
      {MOCK_EVENTS.map((event, index) => (
        <div key={event.id} className="flex gap-4 mb-8">
          <div className="relative">
            <Circle 
              className={`h-6 w-6 ${
                event.status === "completed" 
                  ? "text-green-500" 
                  : event.status === "in_progress"
                  ? "text-blue-500"
                  : "text-gray-300"
              }`} 
              fill="currentColor"
            />
            {index < MOCK_EVENTS.length - 1 && (
              <div className="absolute top-6 left-3 w-px h-full bg-gray-200" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{event.date}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-sm mt-2 ${
              event.status === "completed" 
                ? "bg-green-100 text-green-800"
                : event.status === "in_progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {event.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 