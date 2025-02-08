"use client";

import { useState } from "react";
import { X, FileText, Calendar, DollarSign, RefreshCw, Eye, Download } from "lucide-react";
import DocumentViewer from "@/components/shared/DocumentViewer";

interface ViewExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expense: any;
}

export default function ViewExpenseDialog({
  isOpen,
  onClose,
  expense,
}: ViewExpenseDialogProps) {
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  if (!isOpen || !expense) return null;

  const handleViewDocument = (doc: File) => {
    setSelectedDocument(doc);
  };

  const getDocumentType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'other';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {!selectedDocument ? (
        // Main Expense Details View
        <div className="bg-white rounded-xl max-w-3xl w-full p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">Expense Details</h2>
              <p className="text-sm text-gray-600">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Amount and Category */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Amount</span>
                </div>
                <p className="text-lg font-semibold">
                  ${expense.amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FileText className="h-4 w-4" />
                  <span>Category</span>
                </div>
                <p className="text-lg font-semibold">
                  {expense.category} - {expense.subcategory}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="bg-gray-50 p-4 rounded-lg">
                {expense.description}
              </p>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">{expense.paymentMethod}</span>
                </div>
                
                {/* Conditional payment details based on method */}
                {expense.paymentDetails?.bankName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{expense.paymentDetails.bankName}</span>
                  </div>
                )}
                {expense.paymentDetails?.checkNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check Number:</span>
                    <span className="font-medium">{expense.paymentDetails.checkNumber}</span>
                  </div>
                )}
                {expense.paymentDetails?.cardType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Type:</span>
                    <span className="font-medium">{expense.paymentDetails.cardType}</span>
                  </div>
                )}
                {expense.paymentDetails?.lastFourDigits && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last 4 Digits:</span>
                    <span className="font-medium">{expense.paymentDetails.lastFourDigits}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recurring Details */}
            {expense.recurring && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recurring Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                  <span>Repeats {expense.frequency}</span>
                </div>
              </div>
            )}

            {/* Attachments */}
            {expense.documents?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                <div className="space-y-2">
                  {expense.documents.map((doc: File, idx: number) => (
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
                          onClick={() => handleViewDocument(doc)}
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
      ) : (
        <DocumentViewer
          isOpen={true}
          onClose={() => setSelectedDocument(null)}
          document={selectedDocument}
        />
      )}
    </div>
  );
} 