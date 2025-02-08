"use client";

import { useState } from "react";
import { Calendar, Filter, PieChart, BarChart3, ArrowRight } from "lucide-react";
import ReportFilters from "./ReportFilters";
import ReportPreview from "./ReportPreview";

type ReportType = "expense" | "project" | "combined";
type DateRange = "month" | "quarter" | "year" | "custom";

export default function ReportBuilder() {
  const [reportType, setReportType] = useState<ReportType>("combined");
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [includeOfficeExpenses, setIncludeOfficeExpenses] = useState(true);
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [groupBy, setGroupBy] = useState<"category" | "date" | "project">("category");
  const [showChart, setShowChart] = useState(true);
  const [chartType, setChartType] = useState<"pie" | "bar">("bar");

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Filters Panel */}
      <div className="col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ReportFilters
          reportType={reportType}
          setReportType={setReportType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
          includeOfficeExpenses={includeOfficeExpenses}
          setIncludeOfficeExpenses={setIncludeOfficeExpenses}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          showChart={showChart}
          setShowChart={setShowChart}
          chartType={chartType}
          setChartType={setChartType}
        />
      </div>

      {/* Report Preview */}
      <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <ReportPreview
          reportType={reportType}
          dateRange={dateRange}
          selectedProjects={selectedProjects}
          includeOfficeExpenses={includeOfficeExpenses}
          customDateRange={customDateRange}
          groupBy={groupBy}
          showChart={showChart}
          chartType={chartType}
        />
      </div>
    </div>
  );
} 