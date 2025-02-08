"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, Calendar, PieChart } from "lucide-react";

export default function ExpenseAnalytics() {
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  
  // This would come from your database
  const analyticsData = {
    totalExpenses: 125000,
    monthlyAverage: 12500,
    yearOverYear: 8.5,
    categoryBreakdown: [
      { category: "Insurance", amount: 45000 },
      { category: "Vehicle", amount: 25000 },
      { category: "Office", amount: 30000 },
      { category: "Professional", amount: 15000 },
      { category: "Licenses", amount: 5000 },
      { category: "Software", amount: 5000 },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Timeframe Selection */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expense Analytics</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="rounded-lg border border-gray-300"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <DollarSign className="h-5 w-5" />
            <span>Total Expenses</span>
          </div>
          <p className="text-2xl font-bold">${analyticsData.totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Average</span>
          </div>
          <p className="text-2xl font-bold">${analyticsData.monthlyAverage.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span>Year over Year</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+{analyticsData.yearOverYear}%</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown by Category</h3>
        <div className="space-y-4">
          {analyticsData.categoryBreakdown.map((category) => (
            <div key={category.category}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{category.category}</span>
                <span className="font-semibold">${category.amount.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{
                    width: `${(category.amount / analyticsData.totalExpenses) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 