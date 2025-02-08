"use client";

import { Calendar, Filter, PieChart, BarChart3 } from "lucide-react";

interface ReportFiltersProps {
  reportType: "expense" | "project" | "combined";
  setReportType: (type: "expense" | "project" | "combined") => void;
  dateRange: "month" | "quarter" | "year" | "custom";
  setDateRange: (range: "month" | "quarter" | "year" | "custom") => void;
  selectedProjects: string[];
  setSelectedProjects: (projects: string[]) => void;
  includeOfficeExpenses: boolean;
  setIncludeOfficeExpenses: (include: boolean) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
  groupBy: "category" | "date" | "project";
  setGroupBy: (by: "category" | "date" | "project") => void;
  showChart: boolean;
  setShowChart: (show: boolean) => void;
  chartType: "pie" | "bar";
  setChartType: (type: "pie" | "bar") => void;
}

export default function ReportFilters({
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  selectedProjects,
  setSelectedProjects,
  includeOfficeExpenses,
  setIncludeOfficeExpenses,
  customDateRange,
  setCustomDateRange,
  groupBy,
  setGroupBy,
  showChart,
  setShowChart,
  chartType,
  setChartType,
}: ReportFiltersProps) {
  // Mock projects data
  const MOCK_PROJECTS = [
    { id: "1", name: "Downtown Office Complex" },
    { id: "2", name: "Residential Tower" },
    { id: "3", name: "Shopping Mall" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Report Settings</h3>
        
        {/* Report Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="combined">Combined Report</option>
            <option value="expense">Expense Report</option>
            <option value="project">Project Report</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Project Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Projects
          </label>
          <div className="space-y-2">
            {MOCK_PROJECTS.map((project) => (
              <label key={project.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProjects([...selectedProjects, project.id]);
                    } else {
                      setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                    }
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>{project.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Office Expenses Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeOfficeExpenses}
              onChange={(e) => setIncludeOfficeExpenses(e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Include Office Expenses</span>
          </label>
        </div>

        {/* Group By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group By
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="category">Category</option>
            <option value="date">Date</option>
            <option value="project">Project</option>
          </select>
        </div>

        {/* Chart Options */}
        <div>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={showChart}
              onChange={(e) => setShowChart(e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Chart</span>
          </label>

          {showChart && (
            <div className="flex gap-4">
              <button
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  chartType === "bar"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                Bar
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  chartType === "pie"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <PieChart className="h-5 w-5" />
                Pie
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 