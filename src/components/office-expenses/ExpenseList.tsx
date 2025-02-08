"use client";

import { useState } from "react";
import { Plus, Search, Filter, Calendar, Tag, Eye, Edit2, Trash2 } from "lucide-react";
import AddExpenseDialog from "./AddExpenseDialog";
import ViewExpenseDialog from "./ViewExpenseDialog";
import DeleteExpenseDialog from "./DeleteExpenseDialog";

// Define expense categories
const EXPENSE_CATEGORIES = {
  insurance: {
    label: "Insurance",
    subcategories: ["Liability", "Vehicle", "Workers Comp", "Property"],
  },
  vehicle: {
    label: "Vehicle",
    subcategories: ["Lease", "Maintenance", "Fuel", "Registration"],
  },
  office: {
    label: "Office",
    subcategories: ["Rent", "Utilities", "Maintenance", "Supplies"],
  },
  professional: {
    label: "Professional",
    subcategories: ["Legal", "Accounting", "Consulting"],
  },
  licenses: {
    label: "Licenses & Permits",
    subcategories: ["Business License", "Professional License", "Permits"],
  },
  software: {
    label: "Software & Subscriptions",
    subcategories: ["Project Management", "Accounting", "Communication"],
  },
} as const;

// Mock data
const MOCK_EXPENSES = [
  {
    id: 1,
    date: "2024-02-15",
    category: "insurance",
    subcategory: "Liability",
    description: "General Liability Insurance - Annual Premium",
    amount: 12500,
    recurring: true,
    frequency: "annually",
    status: "paid",
    paymentMethod: "bank_transfer",
    hasDocuments: true,
  },
  {
    id: 2,
    date: "2024-02-01",
    category: "vehicle",
    subcategory: "Lease",
    description: "Company Vehicle Lease Payment",
    amount: 850,
    recurring: true,
    frequency: "monthly",
    status: "paid",
    paymentMethod: "auto_debit",
    hasDocuments: true,
  },
];

export default function ExpenseList() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const openEditDialog = (expense: any) => {
    // Prepare the expense data with the correct type field
    const expenseToEdit = {
      ...expense,
      type: expense.type || "expense", // Make sure type is set
    };
    setSelectedExpense(expenseToEdit);
    setIsEditMode(true);
    setIsAddDialogOpen(true);
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(EXPENSE_CATEGORIES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
          Add Expense
        </button>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {EXPENSE_CATEGORIES[expense.category as keyof typeof EXPENSE_CATEGORIES].label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {expense.subcategory}
                  </span>
                  {expense.recurring && (
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      Recurring ({expense.frequency})
                    </span>
                  )}
                </div>
                <p className="font-medium mb-1">{expense.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{expense.paymentMethod}</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {expense.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  ${expense.amount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setSelectedExpense(expense);
                  setIsViewDialogOpen(true);
                }}
                className="p-2 text-gray-600 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-100"
                title="View Details"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => openEditDialog(expense)}
                className="p-2 text-gray-600 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-100"
                title="Edit Expense"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedExpense(expense);
                  setIsDeleteDialogOpen(true);
                }}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                title="Delete Expense"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddExpenseDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setSelectedExpense(null);
          setIsEditMode(false);
        }}
        onAdd={(expense) => {
          if (isEditMode) {
            setExpenses(prev => prev.map(exp => 
              exp.id === expense.id ? expense : exp
            ));
          } else {
            setExpenses(prev => [expense, ...prev]);
          }
          setIsAddDialogOpen(false);
          setSelectedExpense(null);
          setIsEditMode(false);
        }}
        categories={EXPENSE_CATEGORIES}
        expense={selectedExpense}
        isEditMode={isEditMode}
      />

      <ViewExpenseDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />

      <DeleteExpenseDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedExpense(null);
        }}
        onConfirm={() => {
          if (selectedExpense) {
            setExpenses(prev => prev.filter(exp => exp.id !== selectedExpense.id));
          }
          setIsDeleteDialogOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </div>
  );
} 