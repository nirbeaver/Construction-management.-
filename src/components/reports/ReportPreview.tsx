"use client";

import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ReportPreviewProps {
  reportType: "expense" | "project" | "combined";
  dateRange: "month" | "quarter" | "year" | "custom";
  selectedProjects: string[];
  includeOfficeExpenses: boolean;
  customDateRange: { start: string; end: string };
  groupBy: "category" | "date" | "project";
  showChart: boolean;
  chartType: "pie" | "bar";
}

export default function ReportPreview({
  reportType,
  dateRange,
  selectedProjects,
  includeOfficeExpenses,
  customDateRange,
  groupBy,
  showChart,
  chartType,
}: ReportPreviewProps) {
  // Enhanced mock data
  const summaryData = {
    totalIncome: 750000,
    totalExpenses: 450000,
    netIncome: 300000,
    projectExpenses: 375000,
    officeExpenses: 75000,
    largestExpense: "Construction Materials",
    largestAmount: 125000,
    yearOverYear: 15.5,
  };

  // Project-specific data
  const projectData = {
    "Downtown Office Complex": { income: 400000, expenses: 250000 },
    "Residential Tower": { income: 250000, expenses: 150000 },
    "Shopping Mall": { income: 100000, expenses: 50000 },
  };

  // Monthly trend data
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [120000, 150000, 180000, 160000, 200000, 190000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Expenses',
        data: [90000, 100000, 85000, 95000, 110000, 105000],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  // Expense breakdown data
  const expenseChartData = {
    labels: ['Materials', 'Labor', 'Equipment', 'Office', 'Insurance', 'Other'],
    datasets: [
      {
        label: 'Expenses',
        data: [125000, 100000, 75000, 75000, 50000, 25000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: groupBy === 'category' ? 'Expense Distribution' : 'Project Distribution',
      },
    },
  };

  return (
    <div className="p-6">
      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <DollarSign className="h-5 w-5" />
            <span>Total Income</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ${summaryData.totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <DollarSign className="h-5 w-5" />
            <span>Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            ${summaryData.totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span>Net Income</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${summaryData.netIncome.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-green-600">+{summaryData.yearOverYear}% YoY</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="h-5 w-5" />
            <span>Period</span>
          </div>
          <p className="text-lg font-medium">
            {dateRange === "custom" 
              ? `${customDateRange.start} to ${customDateRange.end}`
              : `This ${dateRange}`}
          </p>
        </div>
      </div>

      {/* Project Performance */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Project Performance</h3>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(projectData).map(([project, data]) => (
            <div key={project} className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">{project}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Income</span>
                  <span className="text-green-600">${data.income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expenses</span>
                  <span className="text-red-600">${data.expenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Net</span>
                  <span className="text-blue-600">
                    ${(data.income - data.expenses).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      {showChart && (
        <div className="space-y-6 mb-8">
          {/* Income vs Expenses Trend */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h3>
            <div className="h-[300px]">
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>

          {/* Expense Distribution */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
            <div className="h-[400px]">
              {chartType === "bar" ? (
                <Bar data={expenseChartData} options={chartOptions} />
              ) : (
                <Pie data={expenseChartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Detailed Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold">Detailed Transaction Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Income</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expense</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">2024-02-{15 + index}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Downtown Office Complex</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Materials</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Construction supplies</td>
                  <td className="px-6 py-4 text-sm text-green-600 text-right">$50,000</td>
                  <td className="px-6 py-4 text-sm text-red-600 text-right">$25,000</td>
                  <td className="px-6 py-4 text-sm text-blue-600 text-right">$25,000</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 text-sm font-medium text-green-600 text-right">$250,000</td>
                <td className="px-6 py-4 text-sm font-medium text-red-600 text-right">$125,000</td>
                <td className="px-6 py-4 text-sm font-medium text-blue-600 text-right">$125,000</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
} 