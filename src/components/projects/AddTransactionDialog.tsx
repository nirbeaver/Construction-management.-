"use client";

import { useState, useEffect } from "react";
import { X, DollarSign, Calendar, FileText, Tag, Building2, Upload } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BANK_OPTIONS, CREDIT_CARD_TYPES, CATEGORIES, CONSTRUCTION_CATEGORIES } from "@/lib/constants/transaction";

type TransactionType = "expense" | "income" | "invoice" | "payment";
type PaymentStatus = "pending" | "completed" | "cancelled";
type CreditCardType = "visa" | "mastercard" | "amex" | "discover";
type CategoryType = typeof CATEGORIES[number]['value'];

const PAYMENT_METHODS = [
  "Bank Transfer",
  "Check",
  "Credit Card",
  "Cash",
  "Other",
] as const;

type BankName = typeof BANK_OPTIONS[number]['value'];

interface DocumentGroup {
  subcategory: string;
  files: File[];
}

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: any) => void;
  projectId: string;
  transaction?: Transaction;
}

export default function AddTransactionDialog({ 
  isOpen, 
  onClose,
  onSubmit,
  projectId,
  transaction
}: AddTransactionDialogProps) {
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState<CategoryType>("");
  const [subCategory, setSubCategory] = useState("");
  const [constructionCategory, setConstructionCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<typeof PAYMENT_METHODS[number]>("Bank Transfer");
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [bankName, setBankName] = useState<BankName>("wells_fargo");
  const [otherBankName, setOtherBankName] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [creditCardType, setCreditCardType] = useState<CreditCardType>("visa");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [documents, setDocuments] = useState<File[]>(transaction?.documents || []);
  const [documentGroups, setDocumentGroups] = useState<DocumentGroup[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    if (transaction) {
      setDate(new Date(transaction.date));
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setMainCategory(transaction.category as CategoryType);
      setPaymentMethod(transaction.paymentMethod as typeof PAYMENT_METHODS[number]);
      setStatus(transaction.status as PaymentStatus);
      setReference(transaction.reference || "");
      setNotes(transaction.notes || "");
      setBankName(transaction.bankName as BankName || "wells_fargo");
      setCheckNumber(transaction.checkNumber || "");
      setCreditCardType((transaction.creditCardType as CreditCardType) || "visa");
      setLastFourDigits(transaction.lastFourDigits || "");
      setDocuments(transaction.documents || []);
    }
  }, [transaction]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransaction = {
      date,
      type,
      amount: parseFloat(amount),
      description,
      category: mainCategory,
      paymentMethod,
      status,
      reference,
      notes,
      documents,
      ...(paymentMethod === "Check" && {
        bankName: bankName === "other" ? otherBankName : bankName,
        checkNumber,
      }),
      ...(paymentMethod === "Credit Card" && {
        creditCardType,
        lastFourDigits,
      }),
    };

    onSubmit(newTransaction);
    onClose();
    
    // Reset form
    setDate(new Date());
    setType("expense");
    setAmount("");
    setDescription("");
    setMainCategory("");
    setSubCategory("");
    setConstructionCategory("");
    setPaymentMethod("Bank Transfer");
    setStatus("pending");
    setReference("");
    setNotes("");
    setDocuments([]);
    setBankName("wells_fargo");
    setOtherBankName("");
    setCheckNumber("");
    setCreditCardType("visa");
    setLastFourDigits("");
  };

  const getSubcategories = () => {
    if (mainCategory === "construction_documents" && constructionCategory) {
      return CONSTRUCTION_CATEGORIES[constructionCategory]?.subcategories || [];
    }
    return CATEGORIES.find(cat => cat.value === mainCategory)?.subcategories || [];
  };

  const handleAddDocumentGroup = (files: FileList | null) => {
    if (!files || !selectedSubcategory) return;

    setDocumentGroups(prev => {
      const newFiles = Array.from(files);
      const existingGroupIndex = prev.findIndex(g => g.subcategory === selectedSubcategory);

      if (existingGroupIndex >= 0) {
        // Add to existing group
        const newGroups = [...prev];
        newGroups[existingGroupIndex] = {
          ...newGroups[existingGroupIndex],
          files: [...newGroups[existingGroupIndex].files, ...newFiles]
        };
        return newGroups;
      } else {
        // Create new group
        return [...prev, { subcategory: selectedSubcategory, files: newFiles }];
      }
    });
  };

  const removeDocument = (groupIndex: number, fileIndex: number) => {
    setDocumentGroups(prev => {
      const newGroups = [...prev];
      newGroups[groupIndex].files = newGroups[groupIndex].files.filter((_, i) => i !== fileIndex);
      if (newGroups[groupIndex].files.length === 0) {
        return newGroups.filter((_, i) => i !== groupIndex);
      }
      return newGroups;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Add Transaction</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div className="grid grid-cols-4 gap-4">
            {["expense", "income", "invoice", "payment"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t as TransactionType)}
                className={`p-4 rounded-lg border ${
                  type === t 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date || new Date())}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter transaction description"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={mainCategory}
                onChange={(e) => {
                  setMainCategory(e.target.value as CategoryType);
                  setSubCategory("");
                  setConstructionCategory("");
                }}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Construction Documents Categories */}
            {mainCategory === "construction_documents" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={constructionCategory}
                  onChange={(e) => {
                    setConstructionCategory(e.target.value);
                    setSubCategory("");
                  }}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Document Type</option>
                  {Object.entries(CONSTRUCTION_CATEGORIES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Subcategory Selection */}
            {mainCategory && (!mainCategory.includes("construction_documents") || constructionCategory) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {getSubcategories().map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as typeof PAYMENT_METHODS[number])}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          {/* Conditional Fields Based on Payment Method */}
          {paymentMethod === "Check" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value as BankName)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {BANK_OPTIONS.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show input field for other bank name if "Other" is selected */}
              {bankName === "other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Bank Name
                  </label>
                  <input
                    type="text"
                    value={otherBankName}
                    onChange={(e) => setOtherBankName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Number
                </label>
                <input
                  type="text"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter check number"
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === "Credit Card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Card Type
                </label>
                <select
                  value={creditCardType}
                  onChange={(e) => setCreditCardType(e.target.value as CreditCardType)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CREDIT_CARD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  value={lastFourDigits}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setLastFourDigits(value);
                  }}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last 4 digits"
                  maxLength={4}
                  pattern="\d{4}"
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              {["pending", "completed", "cancelled"].map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Invoice or reference number"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes or details"
            />
          </div>

          {/* Document Upload Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Category
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Document Type</option>
                {getSubcategories().map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {selectedSubcategory && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleAddDocumentGroup(e.target.files)}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 10MB each
                  </span>
                </label>
              </div>
            )}

            {/* Display Document Groups */}
            {documentGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{group.subcategory}</h4>
                <div className="space-y-2">
                  {group.files.map((file, fileIndex) => (
                    <div key={fileIndex} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(groupIndex, fileIndex)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {transaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 