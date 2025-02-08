"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
};

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: "Foundation Work",
    description: "Complete the foundation laying process",
    status: "in_progress",
    assignee: "John Contractor",
    dueDate: "2024-02-28",
    priority: "high",
  },
  // Add more mock tasks...
];

const STATUS_COLUMNS = [
  { id: "todo", label: "To Do", icon: AlertCircle },
  { id: "in_progress", label: "In Progress", icon: Clock },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
];

export default function TaskBoard({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <Plus className="h-5 w-5" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS_COLUMNS.map((column) => {
          const Icon = column.icon;
          const columnTasks = tasks.filter(task => task.status === column.id);
          
          return (
            <div 
              key={column.id}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">{column.label}</h3>
                <span className="ml-auto bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-4">
                {columnTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h4 className="font-semibold mb-2">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{task.assignee}</span>
                      <span className="text-gray-600">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 