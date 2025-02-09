'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign,
  Building2,
  Calendar,
  Receipt,
  MoreVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  project?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  submittedBy: string;
}

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    description: 'Office Supplies',
    amount: 250.00,
    date: '2024-02-08',
    category: 'Supplies',
    status: 'Approved',
    submittedBy: 'John Doe'
  },
  {
    id: '2',
    description: 'Software Licenses',
    amount: 1200.00,
    date: '2024-02-07',
    category: 'Software',
    status: 'Pending',
    submittedBy: 'Jane Smith'
  },
  {
    id: '3',
    description: 'Site Visit Transportation',
    amount: 75.50,
    date: '2024-02-06',
    project: 'Downtown Office Complex',
    category: 'Travel',
    status: 'Approved',
    submittedBy: 'Mike Johnson'
  }
];

export default function OfficeExpensesPage() {
  const [expenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [filter, setFilter] = useState<Expense['status'] | 'All'>('All');

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = expenses
    .filter(e => e.status === 'Approved')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses
    .filter(e => e.status === 'Pending')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Office Expenses</h1>
        <Button>
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Expenses</p>
              <p className="text-2xl font-bold">${approvedExpenses.toLocaleString()}</p>
            </div>
            <ArrowUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Expenses</p>
              <p className="text-2xl font-bold">${pendingExpenses.toLocaleString()}</p>
            </div>
            <ArrowDown className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as Expense['status'] | 'All')}
            className={`text-sm font-medium ${
              filter === status
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card>
        <div className="divide-y">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Receipt className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium">{expense.description}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {expense.category}
                      </span>
                      {expense.project && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-600">
                            {expense.project}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        Submitted by {expense.submittedBy}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium">
                    ${expense.amount.toLocaleString()}
                  </span>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 