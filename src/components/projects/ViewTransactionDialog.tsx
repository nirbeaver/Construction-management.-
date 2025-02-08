"use client";

import { X, FileText, Calendar, DollarSign, Eye, Download } from "lucide-react";
import { BANK_OPTIONS, CREDIT_CARD_TYPES } from "@/lib/constants/transaction";

interface ViewTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onViewDocument: (doc: File) => void;
}

export default function ViewTransactionDialog({
  isOpen,
  onClose,
  transaction,
  onViewDocument,
}: ViewTransactionDialogProps) {
  if (!isOpen || !transaction) return null;

  // Helper function to get bank label from value
  const getBankLabel = (value: string) => {
    const bank = BANK_OPTIONS.find(bank => bank.value === value);
    return bank ? bank.label : value;
  };

  // Helper function to get credit card label from value
  const getCreditCardLabel = (value: string) => {
    const card = CREDIT_CARD_TYPES.find(card => card.value === value);
    return card ? card.label : value;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{transaction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Amount</h3>
              <p className="mt-1">${transaction.amount.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="mt-1 capitalize">{transaction.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1">{transaction.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 capitalize">{transaction.status}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
            <div className="mt-1">
              <p>{transaction.paymentMethod}</p>
              {transaction.paymentMethod === "Check" && (
                <div className="mt-1 space-y-1 text-sm text-gray-600">
                  <p>Bank: {transaction.bankName === "other" 
                    ? transaction.otherBankName 
                    : getBankLabel(transaction.bankName)
                  }</p>
                  <p>Check #: {transaction.checkNumber}</p>
                </div>
              )}
              {transaction.paymentMethod === "Credit Card" && (
                <div className="mt-1 space-y-1 text-sm text-gray-600">
                  <p>Card: {getCreditCardLabel(transaction.creditCardType)}</p>
                  <p>Card ending in: {transaction.lastFourDigits}</p>
                </div>
              )}
            </div>
          </div>

          {transaction.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 text-gray-600">{transaction.notes}</p>
            </div>
          )}

          {/* Attachments Section */}
          {transaction.documents?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
              <div className="space-y-2">
                {transaction.documents.map((doc: File, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onViewDocument(doc)}
                        className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        title="View Document"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <a
                        href={URL.createObjectURL(doc)}
                        download={doc.name}
                        className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Download Document"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 