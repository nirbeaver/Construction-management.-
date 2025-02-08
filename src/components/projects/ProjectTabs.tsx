"use client";

import { useState } from "react";
import { 
  Receipt, FileText, Calendar, Users, CheckSquare, 
  Plus, Upload
} from "lucide-react";
import TransactionList from "./TransactionList";
import DocumentList from "./DocumentList";
import TaskBoard from "./TaskBoard";
import Timeline from "./Timeline";
import SubcontractorList from "./SubcontractorList";

const tabs = [
  { id: "transactions", label: "Financials", icon: Receipt },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "subcontractors", label: "Subcontractors", icon: Users },
];

export default function ProjectTabs({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 min-w-max transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === "transactions" && <TransactionList projectId={projectId} />}
        {activeTab === "documents" && <DocumentList projectId={projectId} />}
        {activeTab === "timeline" && <Timeline projectId={projectId} />}
        {activeTab === "tasks" && <TaskBoard projectId={projectId} />}
        {activeTab === "subcontractors" && <SubcontractorList projectId={projectId} />}
      </div>
    </div>
  );
} 