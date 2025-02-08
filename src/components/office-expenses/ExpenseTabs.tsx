"use client";

import { useState } from "react";
import { Receipt, FileText, PieChart } from "lucide-react";
import ExpenseList from "./ExpenseList";
import ExpenseDocuments from "./ExpenseDocuments";
import ExpenseAnalytics from "./ExpenseAnalytics";

const tabs = [
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "analytics", label: "Analytics", icon: PieChart },
];

export default function ExpenseTabs() {
  const [activeTab, setActiveTab] = useState("expenses");

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
        {activeTab === "expenses" && <ExpenseList />}
        {activeTab === "documents" && <ExpenseDocuments />}
        {activeTab === "analytics" && <ExpenseAnalytics />}
      </div>
    </div>
  );
} 