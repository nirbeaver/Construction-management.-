"use client";

import { useState, useEffect } from "react";
import { X, Upload, FileText, Calendar, DollarSign } from "lucide-react";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: any) => void;
  categories: any;
  expense?: any;
  isEditMode?: boolean;
}

type PaymentMethod = "bank_transfer" | "check" | "credit_card" | "zelle" | "venmo" | "cash";
type BankName = "wells_fargo" | "citibank" | "chase" | "bank_of_america" | "other";
type CreditCardType = "amex" | "discover" | "visa" | "mastercard";

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "check", label: "Check" },
  { value: "credit_card", label: "Credit Card" },
  { value: "zelle", label: "Zelle" },
  { value: "venmo", label: "Venmo" },
  { value: "cash", label: "Cash" },
] as const;

const BANKS = [
  { value: "wells_fargo", label: "Wells Fargo" },
  { value: "citibank", label: "Citibank" },
  { value: "chase", label: "Chase" },
  { value: "bank_of_america", label: "Bank of America" },
  { value: "other", label: "Other" },
] as const;

const CREDIT_CARDS = [
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
] as const;

export default function AddExpenseDialog({
  isOpen,
  onClose,
  onAdd,
  categories,
  expense,
  isEditMode = false,
}: AddExpenseDialogProps) {
  const [category, setCategory] = useState(isEditMode ? expense?.type || "expense" : "expense");
  const [mainCategory, setMainCategory] = useState(isEditMode ? expense?.category || "" : "");
  const [subcategory, setSubcategory] = useState(isEditMode ? expense?.subcategory || "" : "");
  const [description, setDescription] = useState(isEditMode ? expense?.description || "" : "");
  const [amount, setAmount] = useState(isEditMode ? expense?.amount?.toString() || "" : "");
  const [date, setDate] = useState(isEditMode ? expense?.date || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [recurring, setRecurring] = useState(isEditMode ? expense?.recurring || false : false);
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "annually">(
    isEditMode ? expense?.frequency || "monthly" : "monthly"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    isEditMode ? expense?.paymentMethod || "bank_transfer" : "bank_transfer"
  );
  const [bankName, setBankName] = useState<BankName>(
    isEditMode ? expense?.paymentDetails?.bankName || "wells_fargo" : "wells_fargo"
  );
  const [otherBankName, setOtherBankName] = useState(
    isEditMode ? expense?.paymentDetails?.otherBankName || "" : ""
  );
  const [checkNumber, setCheckNumber] = useState(
    isEditMode ? expense?.paymentDetails?.checkNumber || "" : ""
  );
  const [documents, setDocuments] = useState<File[]>(
    isEditMode ? expense?.documents || [] : []
  );
  const [creditCardType, setCreditCardType] = useState<CreditCardType>("visa");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [zelleAccount, setZelleAccount] = useState("");
  const [venmoAccount, setVenmoAccount] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    if (isEditMode && expense) {
      // Set transaction type first
      setCategory(expense.type || "expense"); // Set default type to "expense" if not specified
      
      // Set main category and subcategory
      setMainCategory(expense.category || "");
      setSubcategory(expense.subcategory || "");
      
      // Set basic details
      setDescription(expense.description || "");
      setAmount(expense.amount?.toString() || "");
      setDate(expense.date || new Date().toISOString().split('T')[0]);
      
      // Set recurring settings
      setRecurring(expense.recurring || false);
      setFrequency(expense.frequency || "monthly");
      
      // Set payment method and related details
      setPaymentMethod(expense.paymentMethod || "bank_transfer");
      
      // Set bank details
      if (expense.paymentDetails?.bankName === "other") {
        setBankName("other");
        setOtherBankName(expense.paymentDetails?.otherBankName || "");
      } else {
        setBankName(expense.paymentDetails?.bankName || "wells_fargo");
      }
      
      // Set check details
      setCheckNumber(expense.paymentDetails?.checkNumber || "");
      
      // Set credit card details
      setCreditCardType(expense.paymentDetails?.cardType || "visa");
      setLastFourDigits(expense.paymentDetails?.lastFourDigits || "");
      
      // Set digital payment details
      setZelleAccount(expense.paymentDetails?.zelleAccount || "");
      setVenmoAccount(expense.paymentDetails?.venmoAccount || "");
      
      // Set invoice number if applicable
      setInvoiceNumber(expense.invoiceNumber || "");
      
      // Set documents
      setDocuments(expense.documents || []);
    }
  }, [isEditMode, expense]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      id: isEditMode ? expense.id : Date.now(),
      category: mainCategory,
      subcategory,
      description,
      amount: parseFloat(amount),
      date,
      recurring,
      frequency: recurring ? frequency : null,
      status: isEditMode ? expense.status : "pending",
      paymentMethod,
      paymentDetails: {
        ...(paymentMethod === "check" && {
          bankName: bankName === "other" ? otherBankName : bankName,
          checkNumber,
        }),
        ...(paymentMethod === "credit_card" && {
          cardType: creditCardType,
          lastFourDigits,
        }),
        ...(paymentMethod === "bank_transfer" && {
          bankName: bankName === "other" ? otherBankName : bankName,
        }),
        ...(paymentMethod === "zelle" && {
          zelleAccount,
        }),
        ...(paymentMethod === "venmo" && {
          venmoAccount,
        }),
      },
      ...(category === "invoice" && { invoiceNumber }),
      hasDocuments: documents.length > 0,
      documents: documents,
    };

    onAdd(expenseData);
    onClose();
    if (!isEditMode) {
      setCategory("expense");
      setMainCategory("");
      setSubcategory("");
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
      setRecurring(false);
      setFrequency("monthly");
      setPaymentMethod("bank_transfer");
      setBankName("wells_fargo");
      setOtherBankName("");
      setCheckNumber("");
      setCreditCardType("visa");
      setLastFourDigits("");
      setZelleAccount("");
      setVenmoAccount("");
      setDocuments([]);
      setInvoiceNumber("");
    }
  };

  // Get subcategories based on transaction type
  const getSubcategories = () => {
    if (category === "expense") return Object.keys(categories);
    if (category === "invoice" || category === "income" || category === "payment") {
      return ["Sales", "Services", "Rental", "Other"];
    }
    return [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isEditMode ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="expense-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setMainCategory("");
                  setSubcategory("");
                }}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="invoice">Invoice</option>
                <option value="payment">Payment</option>
              </select>
            </div>

            {/* Invoice Number Field - Only shows when invoice is selected */}
            {category === "invoice" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter invoice number"
                  required
                />
              </div>
            )}

            {/* Category and Subcategory Selection */}
            {category && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={mainCategory}
                    onChange={(e) => {
                      setMainCategory(e.target.value);
                      setSubcategory("");
                    }}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {category === "expense" 
                      ? Object.entries(categories).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))
                      : getSubcategories().map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))
                    }
                  </select>
                </div>

                {category === "expense" && mainCategory && categories[mainCategory] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {categories[mainCategory]?.subcategories.map((sub: string) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Amount and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>

            {/* Recurring Options */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                  Recurring Expense
                </label>
              </div>

              {recurring && (
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {PAYMENT_METHODS.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check Details */}
              {paymentMethod === "check" && (
                <div className="space-y-4">
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
                      {BANKS.map(bank => (
                        <option key={bank.value} value={bank.value}>
                          {bank.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Other Bank Name Input */}
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

              {/* Credit Card Details */}
              {paymentMethod === "credit_card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Card Type
                    </label>
                    <select
                      value={creditCardType}
                      onChange={(e) => setCreditCardType(e.target.value as CreditCardType)}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {CREDIT_CARDS.map(card => (
                        <option key={card.value} value={card.value}>
                          {card.label}
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
                        // Only allow numbers and limit to 4 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setLastFourDigits(value);
                      }}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter last 4 digits"
                      pattern="\d{4}"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === "bank_transfer" && (
                <div className="space-y-4">
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
                      {BANKS.map(bank => (
                        <option key={bank.value} value={bank.value}>
                          {bank.label}
                        </option>
                      ))}
                    </select>
                  </div>

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
                </div>
              )}

              {/* Zelle/Venmo Details */}
              {(paymentMethod === "zelle" || paymentMethod === "venmo") && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {paymentMethod === "zelle" ? "Zelle" : "Venmo"} Account
                    </label>
                    <input
                      type="text"
                      value={paymentMethod === "zelle" ? zelleAccount : venmoAccount}
                      onChange={(e) => {
                        if (paymentMethod === "zelle") {
                          setZelleAccount(e.target.value);
                        } else {
                          setVenmoAccount(e.target.value);
                        }
                      }}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${paymentMethod === "zelle" ? "Zelle" : "Venmo"} account (email/phone)`}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setDocuments(Array.from(e.target.files || []))}
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
              {/* Display selected files */}
              {documents.length > 0 && (
                <div className="mt-2 space-y-2">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-white">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              form="expense-form"
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isEditMode ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 