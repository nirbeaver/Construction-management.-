"use client";

import { useState } from "react";
import { X, DollarSign, Calendar } from "lucide-react";

type PaymentMethod = "check" | "bank_transfer" | "credit_card" | "cash";

interface AddPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: any) => void;
  subcontractor: any | null;
}

export default function AddPaymentDialog({
  isOpen,
  onClose,
  onAdd,
  subcontractor,
}: AddPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [checkNumber, setCheckNumber] = useState("");
  const [bankName, setBankName] = useState("");

  if (!isOpen || !subcontractor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payment = {
      amount: parseFloat(amount),
      description,
      date,
      paymentMethod,
      ...(paymentMethod === "check" && {
        checkNumber,
        bankName,
      }),
    };

    onAdd(payment);
    
    // Reset form
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod("bank_transfer");
    setCheckNumber("");
    setBankName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Add Payment</h2>
            <p className="text-sm text-gray-600">
              For {subcontractor.company} - {subcontractor.role}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "bank_transfer", label: "Bank Transfer" },
                { value: "check", label: "Check" },
                { value: "credit_card", label: "Credit Card" },
                { value: "cash", label: "Cash" },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Check Details */}
          {paymentMethod === "check" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Number
                </label>
                <input
                  type="text"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          )}

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
              placeholder="Payment description or reference"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
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
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 