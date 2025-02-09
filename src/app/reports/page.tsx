'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart2, DollarSign, Calendar } from 'lucide-react';

const REPORT_TYPES = [
  {
    id: 'financial',
    name: 'Financial Reports',
    description: 'View financial summaries, cost tracking, and budget analysis',
    icon: DollarSign,
    reports: [
      'Budget vs. Actual',
      'Cost Tracking',
      'Payment Summary',
      'Expense Analysis'
    ]
  },
  {
    id: 'progress',
    name: 'Progress Reports',
    description: 'Track project progress, milestones, and completion rates',
    icon: BarChart2,
    reports: [
      'Project Timeline',
      'Milestone Tracking',
      'Task Completion',
      'Delay Analysis'
    ]
  },
  {
    id: 'schedule',
    name: 'Schedule Reports',
    description: 'Analyze project schedules, timelines, and resource allocation',
    icon: Calendar,
    reports: [
      'Project Schedule',
      'Resource Allocation',
      'Timeline Analysis',
      'Delay Impact'
    ]
  },
  {
    id: 'documents',
    name: 'Document Reports',
    description: 'Generate reports on document submissions and approvals',
    icon: FileText,
    reports: [
      'Document Status',
      'Approval Tracking',
      'Submission Log',
      'Review Status'
    ]
  }
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button>
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPORT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <Card 
              key={type.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedType === type.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                  
                  {selectedType === type.id && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {type.reports.map((report) => (
                        <Button
                          key={report}
                          variant="outline"
                          className="justify-start text-sm"
                        >
                          {report}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 