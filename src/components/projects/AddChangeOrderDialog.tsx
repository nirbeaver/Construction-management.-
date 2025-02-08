"use client";

import { useState } from "react";
import { X, FileText, Upload } from "lucide-react";

type DurationType = "days" | "weeks" | "months";

interface AddChangeOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (changeOrder: any) => void;
  subcontractor: any | null;
}

export default function AddChangeOrderDialog({
  isOpen,
  onClose,
  onAdd,
  subcontractor,
}: AddChangeOrderDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState("0");
  const [durationType, setDurationType] = useState<DurationType>("days");
  const [documents, setDocuments] = useState<File[]>([]);

  if (!isOpen || !subcontractor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const changeOrder = {
      description,
      amount: parseFloat(amount),
      date,
      status: "pending" as const,
      duration: parseInt(duration),
      durationType,
      documents: documents,
      // Calculate additional days based on duration type
      additionalDays: calculateAdditionalDays(parseInt(duration), durationType),
    };

    onAdd(changeOrder);
    
    // Reset form
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split('T')[0]);
    setDuration("0");
    setDurationType("days");
    setDocuments([]);
    onClose();
  };

  const calculateAdditionalDays = (duration: number, type: DurationType) => {
    switch (type) {
      case "days":
        return duration;
      case "weeks":
        return duration * 7;
      case "months":
        return duration * 30; // Approximate
      default:
        return 0;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Add Change Order</h2>
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
              placeholder="Describe the changes and reason"
            />
          </div>

          {/* Amount */}
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
                className="w-full rounded-lg border border-gray-300 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Duration Extension */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
              <select
                value={durationType}
                onChange={(e) => setDurationType(e.target.value as DurationType)}
                className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          {/* Date */}
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

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="document-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="document-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Add Documents
                </label>
              </div>
              
              {/* Document List */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              Add Change Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 