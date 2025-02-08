"use client";

import { useState } from "react";
import { X, Calendar, Upload, FileText } from "lucide-react";

interface AddSubcontractorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subcontractor: any, contract?: File) => void;
}

type DurationType = "days" | "weeks" | "months";

export default function AddSubcontractorDialog({
  isOpen,
  onClose,
  onAdd,
}: AddSubcontractorDialogProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [contractAmount, setContractAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState("1");
  const [durationType, setDurationType] = useState<DurationType>("weeks");
  const [contract, setContract] = useState<File | null>(null);

  if (!isOpen) return null;

  const calculateEndDate = () => {
    try {
      const start = new Date(startDate);
      const durationNum = parseInt(duration);
      
      if (isNaN(start.getTime())) {
        return startDate; // Return the original string if date is invalid
      }
      
      const end = new Date(start);
      
      switch (durationType) {
        case "days":
          end.setDate(end.getDate() + durationNum);
          break;
        case "weeks":
          end.setDate(end.getDate() + (durationNum * 7));
          break;
        case "months":
          end.setMonth(end.getMonth() + durationNum);
          break;
      }
      
      return end.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error calculating end date:', error);
      return startDate; // Fallback to start date if calculation fails
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subcontractor = {
      name,
      company,
      role,
      email,
      phone,
      estimatedCost: parseFloat(estimatedCost),
      actualCost: 0,
      contractAmount: parseFloat(contractAmount),
      startDate,
      duration: parseInt(duration),
      durationType,
      endDate: calculateEndDate(),
      progress: 0,
      status: "pending" as const,
      hasContract: !!contract,
    };

    onAdd(subcontractor, contract || undefined);
    
    // Reset form
    setName("");
    setCompany("");
    setRole("");
    setEmail("");
    setPhone("");
    setEstimatedCost("");
    setContractAmount("");
    setStartDate(new Date().toISOString().split('T')[0]);
    setDuration("1");
    setDurationType("weeks");
    setContract(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Subcontractor</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role / Trade
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="e.g., Electrical Contractor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Schedule Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={durationType}
                    onChange={(e) => setDurationType(e.target.value as DurationType)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated End Date
                </label>
                <input
                  type="date"
                  value={calculateEndDate()}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Contract Upload */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Contract Document</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Contract
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    {contract ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span>{contract.name}</span>
                        <button
                          type="button"
                          onClick={() => setContract(null)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          onChange={(e) => setContract(e.target.files?.[0] || null)}
                          className="hidden"
                          id="contract-upload"
                          accept=".pdf,.doc,.docx"
                        />
                        <label
                          htmlFor="contract-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Contract File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Upload contract document (PDF, DOC, DOCX)
                </p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Contract Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={contractAmount}
                    onChange={(e) => setContractAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
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
              Add Subcontractor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 