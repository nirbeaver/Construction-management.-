"use client";

import { DollarSign, TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react";

export default function ExpenseHeader() {
  // This would come from your database
  const summaryData = {
    totalExpenses: 125000,
    monthlyAverage: 12500,
    largestCategory: "Insurance",
    largestAmount: 45000,
    monthlyChange: 8.5,
    isIncreased: true,
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Office Expenses</h1>
          <p className="text-gray-600">Track and manage office-related expenses</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <Plus className="h-5 w-5" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <DollarSign className="h-5 w-5" />
            <span>Total Expenses (YTD)</span>
          </div>
          <p className="text-2xl font-bold">${summaryData.totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Average</span>
          </div>
          <p className="text-2xl font-bold">${summaryData.monthlyAverage.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <DollarSign className="h-5 w-5" />
            <span>Largest Category</span>
          </div>
          <p className="text-2xl font-bold">{summaryData.largestCategory}</p>
          <p className="text-sm text-gray-600">${summaryData.largestAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            {summaryData.isIncreased ? (
              <TrendingUp className="h-5 w-5 text-red-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-green-500" />
            )}
            <span>Monthly Change</span>
          </div>
          <p className={`text-2xl font-bold ${
            summaryData.isIncreased ? 'text-red-500' : 'text-green-500'
          }`}>
            {summaryData.monthlyChange}%
          </p>
        </div>
      </div>
    </div>
  );
} 