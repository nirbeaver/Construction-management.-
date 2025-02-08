"use client";

import { useState } from "react";
import { 
  Users, Phone, Mail, Building, Plus, DollarSign, FileText, 
  AlertTriangle, Edit2, Upload, Info, MoreVertical, ChevronDown 
} from "lucide-react";
import AddSubcontractorDialog from "./AddSubcontractorDialog";
import AddChangeOrderDialog from "./AddChangeOrderDialog";
import AddPaymentDialog from "./AddPaymentDialog";
import ViewSubcontractorDialog from "./ViewSubcontractorDialog";
import ViewChangeOrderDialog from "./ViewChangeOrderDialog";

interface ChangeOrder {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  additionalDays: number;
  duration: number;
  endDate: string;
}

interface Payment {
  id: number;
  amount: number;
  date: string;
  description: string;
  type: "payment" | "deposit";
}

interface Subcontractor {
  id: number;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  estimatedCost: number;
  actualCost: number;
  contractAmount: number;
  changeOrders: ChangeOrder[];
  payments: Payment[];
  progress: number;
  status: "active" | "completed" | "pending";
  hasContract: boolean;
  contractUrl?: string;
  endDate: string;
  duration: number;
}

export default function SubcontractorList({ projectId }: { projectId: string }) {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isChangeOrderDialogOpen, setIsChangeOrderDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<Subcontractor | null>(null);
  const [selectedChangeOrder, setSelectedChangeOrder] = useState<any>(null);
  const [isViewChangeOrderDialogOpen, setIsViewChangeOrderDialogOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const handleAddSubcontractor = async (newSubcontractor: Omit<Subcontractor, 'id'>, contract?: File) => {
    // Here you would typically:
    // 1. Upload the contract file to your storage (Firebase, etc.)
    // 2. Get the download URL
    // 3. Save the subcontractor with the contract URL
    
    const subcontractor: Subcontractor = {
      ...newSubcontractor,
      id: subcontractors.length + 1,
      changeOrders: [],
      payments: [],
      contractUrl: contract ? 'url_to_contract' : undefined, // Replace with actual upload logic
    };
    
    setSubcontractors(prev => [...prev, subcontractor]);
  };

  const handleAddChangeOrder = (subcontractorId: number, changeOrder: Omit<ChangeOrder, 'id'>) => {
    setSubcontractors(prev => prev.map(sub => {
      if (sub.id === subcontractorId) {
        const newChangeOrder = {
          ...changeOrder,
          id: sub.changeOrders.length + 1,
        };

        // Calculate new end date based on additional duration
        const currentEndDate = new Date(sub.endDate);
        currentEndDate.setDate(currentEndDate.getDate() + changeOrder.additionalDays);
        
        return {
          ...sub,
          changeOrders: [...sub.changeOrders, newChangeOrder],
          actualCost: sub.actualCost + changeOrder.amount,
          endDate: currentEndDate.toISOString().split('T')[0],
          duration: sub.duration + changeOrder.additionalDays, // Update total duration
        };
      }
      return sub;
    }));
  };

  const handleAddPayment = (subcontractorId: number, payment: Omit<Payment, 'id'>) => {
    setSubcontractors(prev => prev.map(sub => {
      if (sub.id === subcontractorId) {
        const newPayment = {
          ...payment,
          id: sub.payments.length + 1,
        };
        return {
          ...sub,
          payments: [...sub.payments, newPayment],
          actualCost: sub.actualCost + payment.amount,
        };
      }
      return sub;
    }));
  };

  const calculateTotals = (subcontractor: Subcontractor) => {
    // Calculate total of ALL change orders, not just approved ones
    const totalChangeOrders = subcontractor.changeOrders
      // .filter(co => co.status === "approved") // Remove this filter for now
      .reduce((sum, co) => sum + co.amount, 0);
    
    const totalPayments = subcontractor.payments
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const totalContractValue = subcontractor.contractAmount + totalChangeOrders;
    const remainingBalance = totalContractValue - totalPayments;
    const isOverBudget = totalContractValue > subcontractor.estimatedCost;

    return {
      totalChangeOrders,
      totalPayments,
      totalContractValue,
      remainingBalance,
      isOverBudget,
    };
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Subcontractors</h2>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
          Add Subcontractor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {subcontractors.map((sub) => {
          const totals = calculateTotals(sub);
          const isExpanded = expandedIds.includes(sub.id);
          
          return (
            <div 
              key={sub.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-start"
                onClick={() => toggleExpand(sub.id)}
              >
                <div className="flex items-center gap-4">
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`} />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{sub.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{sub.company}</span>
                      {sub.hasContract && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                          <FileText className="h-3 w-3" />
                          Contract Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div>
                    <p className="text-sm text-gray-600">Original Contract</p>
                    <p className="text-xl font-bold">${sub.contractAmount.toLocaleString()}</p>
                  </div>
                  {sub.changeOrders.length > 0 && (
                    <div className="mt-1">
                      <p className="text-sm text-gray-600">
                        Change Orders ({sub.changeOrders.length}): +${totals.totalChangeOrders.toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        Total: ${totals.totalContractValue.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t">
                  {sub.changeOrders.length > 0 && (
                    <div className="p-4 border-b">
                      <p className="font-medium mb-3">Change Orders</p>
                      <div className="space-y-2">
                        {sub.changeOrders.map((co, index) => (
                          <div 
                            key={co.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedChangeOrder(co);
                              setSelectedSubcontractor(sub);
                              setIsViewChangeOrderDialogOpen(true);
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium">CO #{index + 1}</span>
                              <span className="text-sm text-gray-600">{co.description}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                co.status === 'approved' 
                                  ? 'bg-green-100 text-green-800'
                                  : co.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {co.status}
                              </span>
                            </div>
                            <span className="font-medium">${co.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                      <p className="text-lg font-semibold">${sub.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${totals.totalPayments.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                      <p className="text-lg font-semibold text-red-600">
                        ${totals.remainingBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubcontractor(sub);
                        setIsChangeOrderDialogOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4" />
                      Add Change Order
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubcontractor(sub);
                        setIsPaymentDialogOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <DollarSign className="h-4 w-4" />
                      Add Payment
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubcontractor(sub);
                          setIsViewDialogOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-100"
                        title="View Details"
                      >
                        <Info className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubcontractor(sub);
                          setIsEditMode(true);
                          setIsAddDialogOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-100"
                        title="Edit Subcontractor"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddSubcontractorDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddSubcontractor}
      />

      <AddChangeOrderDialog
        isOpen={isChangeOrderDialogOpen}
        onClose={() => {
          setIsChangeOrderDialogOpen(false);
          setSelectedSubcontractor(null);
        }}
        onAdd={(changeOrder) => {
          if (selectedSubcontractor) {
            handleAddChangeOrder(selectedSubcontractor.id, changeOrder);
          }
        }}
        subcontractor={selectedSubcontractor}
      />

      <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setSelectedSubcontractor(null);
        }}
        onAdd={(payment) => {
          if (selectedSubcontractor) {
            handleAddPayment(selectedSubcontractor.id, payment);
          }
        }}
        subcontractor={selectedSubcontractor}
      />

      <ViewSubcontractorDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedSubcontractor(null);
        }}
        subcontractor={selectedSubcontractor}
      />

      <ViewChangeOrderDialog
        isOpen={isViewChangeOrderDialogOpen}
        onClose={() => {
          setIsViewChangeOrderDialogOpen(false);
          setSelectedChangeOrder(null);
          setSelectedSubcontractor(null);
        }}
        changeOrder={selectedChangeOrder}
        orderNumber={selectedChangeOrder ? 
          selectedSubcontractor?.changeOrders.findIndex(
            co => co.id === selectedChangeOrder.id
          ) + 1 || 1 : 0}
        subcontractor={selectedSubcontractor}
      />
    </>
  );
} 