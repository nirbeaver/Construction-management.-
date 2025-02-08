"use client";

import { useState } from "react";
import { X, FileText, Calendar, DollarSign, Clock } from "lucide-react";

interface ViewChangeOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  changeOrder: any;
  orderNumber: number;
  subcontractor: any;
}

export default function ViewChangeOrderDialog({
  isOpen,
  onClose,
  changeOrder,
  orderNumber,
  subcontractor,
}: ViewChangeOrderDialogProps) {
  if (!isOpen || !changeOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-semibold">Change Order #{orderNumber}</h2>
              <span className={`px-2 py-1 rounded-full text-sm ${
                changeOrder.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : changeOrder.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {changeOrder.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {subcontractor.company} - {subcontractor.role}
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
          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span>Amount</span>
              </div>
              <p className="text-lg font-semibold">
                ${changeOrder.amount.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
              <p className="text-lg">
                {new Date(changeOrder.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="bg-gray-50 p-4 rounded-lg">
              {changeOrder.description}
            </p>
          </div>

          {/* Duration Extension */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule Impact</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Additional Duration</span>
                  </div>
                  <p>
                    {changeOrder.duration} {changeOrder.durationType}
                    {changeOrder.duration > 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Extended End Date</span>
                  </div>
                  <p>{new Date(changeOrder.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {changeOrder.documents?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Supporting Documents</h3>
              <div className="space-y-2">
                {changeOrder.documents.map((doc: File, idx: number) => (
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
                    <button className="px-3 py-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                      View
                    </button>
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