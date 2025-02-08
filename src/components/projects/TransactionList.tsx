"use client";

import { useState } from "react";
import { DollarSign, Plus, Trash2, Edit2, Eye, FileText, Download } from "lucide-react";
import AddTransactionDialog from "./AddTransactionDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ViewTransactionDialog from "./ViewTransactionDialog";
import DocumentViewer from "@/components/shared/DocumentViewer";

interface Transaction {
  id: number;
  date: string | Date;
  description: string;
  amount: number;
  type: "expense" | "income" | "invoice" | "payment";
  category: string;
  status: string;
  paymentMethod?: string;
  bankName?: string;
  checkNumber?: string;
  creditCardType?: string;
  lastFourDigits?: string;
  documents: File[];
  reference?: string;
  notes?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Initial Payment to Contractor",
    amount: 250000,
    type: "expense",
    category: "Labor",
    status: "completed",
    documents: [],
  },
  {
    id: 2,
    date: "2024-01-20",
    description: "Materials Purchase - Steel",
    amount: 75000,
    type: "expense",
    category: "Materials",
    status: "completed",
    documents: [],
  },
  // Add more mock transactions...
];

export default function TransactionList({ projectId }: { projectId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: transactions.length + 1,
      date: new Date(newTransaction.date),
      documents: newTransaction.documents || [],
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    setSelectedTransaction(null);
    setIsEditMode(false);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditMode(true);
    setIsAddDialogOpen(true);
  };

  const openViewDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Financial Transactions</h2>
        <button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
          Add Transaction
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{transaction.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  {transaction.date instanceof Date 
                    ? transaction.date.toLocaleDateString()
                    : transaction.date}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  {transaction.category}
                </span>
                {transaction.documents?.length > 0 && (
                  <span className="flex items-center gap-1 text-blue-500">
                    <FileText className="h-4 w-4" />
                    {transaction.documents.length} attachment(s)
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className={`text-lg font-semibold ${
                  transaction.type === "expense" ? "text-red-600" : "text-green-600"
                }`}>
                  {transaction.type === "expense" ? "-" : "+"}
                  ${transaction.amount.toLocaleString()}
                </p>
                <span className="text-sm text-gray-600">{transaction.status}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsViewDialogOpen(true);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEditDialog(transaction)}
                  className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Edit Transaction"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteDialog(transaction)}
                  className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete Transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddTransactionDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setSelectedTransaction(null);
          setIsEditMode(false);
        }}
        onSubmit={isEditMode ? handleEditTransaction : handleAddTransaction}
        transaction={isEditMode ? selectedTransaction : undefined}
        projectId={projectId}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTransaction(null);
        }}
        onConfirm={() => selectedTransaction && handleDeleteTransaction(selectedTransaction.id)}
        transaction={selectedTransaction}
      />

      <ViewTransactionDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onViewDocument={(doc) => setSelectedDocument(doc)}
      />

      {selectedDocument && (
        <DocumentViewer
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          document={selectedDocument}
        />
      )}
    </>
  );
} 