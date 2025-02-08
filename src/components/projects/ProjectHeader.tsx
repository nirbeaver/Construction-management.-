"use client";

import { Building2, MapPin, Calendar, DollarSign } from "lucide-react";

// This would come from your database
const PROJECT_DATA = {
  name: "Downtown Office Complex",
  address: "123 Main St, City, State 12345",
  status: "In Progress",
  budget: 2500000,
  spent: 1200000,
  startDate: "2024-01-15",
  endDate: "2024-12-31",
  completion: 48,
};

export default function ProjectHeader({ projectId }: { projectId: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{PROJECT_DATA.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-5 w-5 mr-2" />
            {PROJECT_DATA.address}
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            {PROJECT_DATA.status}
          </span>
        </div>
        
        <div className="text-right">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Total Budget</p>
            <p className="text-2xl font-bold">${PROJECT_DATA.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Spent</p>
            <p className="text-xl font-semibold text-blue-600">
              ${PROJECT_DATA.spent.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="h-2 bg-gray-200 rounded-full mb-4">
        <div 
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${PROJECT_DATA.completion}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>Start: {PROJECT_DATA.startDate}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>End: {PROJECT_DATA.endDate}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="h-5 w-5" />
          <span>Completion: {PROJECT_DATA.completion}%</span>
        </div>
      </div>
    </div>
  );
} 