"use client";

import { useState } from "react";
import { X, FileText, DollarSign, Calendar, Building, ChevronDown, Clock } from "lucide-react";

interface ViewSubcontractorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subcontractor: any | null;
}

export default function ViewSubcontractorDialog({
  isOpen,
  onClose,
  subcontractor,
}: ViewSubcontractorDialogProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'changes' | 'payments' | 'documents'>('overview');

  if (!isOpen || !subcontractor) return null;

  const totals = {
    originalContract: subcontractor.contractAmount,
    changeOrders: subcontractor.changeOrders
      .reduce((sum: number, co: any) => sum + co.amount, 0),
    payments: subcontractor.payments
      .reduce((sum: number, payment: any) => sum + payment.amount, 0),
  };

  const totalContractValue = totals.originalContract + totals.changeOrders;
  const remainingBalance = totalContractValue - totals.payments;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-1">{subcontractor.name}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4" />
                <span>{subcontractor.company}</span>
                {subcontractor.hasContract && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                    <FileText className="h-3 w-3" />
                    Contract Uploaded
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Original Contract</p>
              <p className="text-lg font-semibold">
                ${totals.originalContract.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Change Orders</p>
              <p className="text-lg font-semibold text-blue-600">
                +${totals.changeOrders.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Contract Value</p>
              <p className="text-lg font-semibold text-green-600">
                ${totalContractValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
              <p className="text-lg font-semibold text-red-600">
                ${remainingBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'changes', label: 'Change Orders' },
              { id: 'payments', label: 'Payments' },
              { id: 'documents', label: 'Documents' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p>{subcontractor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p>{subcontractor.phone}</p>
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p>{new Date(subcontractor.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p>{new Date(subcontractor.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                      <p className="text-lg font-semibold">
                        ${subcontractor.estimatedCost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${totals.payments.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changes' && (
            <div className="space-y-4">
              {subcontractor.changeOrders.map((co: any, index: number) => (
                <div key={co.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">Change Order #{index + 1}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            co.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : co.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {co.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{co.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                          ${co.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(co.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Duration Extension</p>
                          <p>{co.duration} {co.durationType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Documents</p>
                          <div className="flex gap-2">
                            {co.documents?.map((doc: any, idx: number) => (
                              <span key={idx} className="text-blue-500 hover:underline cursor-pointer">
                                View Document
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              {subcontractor.payments.map((payment: any, index: number) => (
                <div key={payment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-1">Payment #{index + 1}</h4>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                          {payment.paymentMethod}
                        </span>
                        {payment.paymentMethod === 'check' && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Bank: {payment.bankName}</p>
                            <p>Check #: {payment.checkNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {subcontractor.hasContract && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Contract Document</p>
                      <p className="text-sm text-gray-500">Original Contract</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                    View
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 