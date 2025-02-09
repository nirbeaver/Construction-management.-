"use client";

import { useState, useEffect } from 'react';
import { Report } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getUserReports, createReport } from '@/lib/firebase/firebaseUtils';
import { useToast } from '@/components/ui/use-toast';
import { CreateReportDialog } from './CreateReportDialog';

const EXAMPLE_REPORTS: Report[] = [
  {
    id: 'example-1',
    name: 'Q1 2024 Progress Report',
    type: 'Progress',
    date: '2024-03-31',
    data: {},
    status: 'Generated'
  },
  {
    id: 'example-2',
    name: 'Financial Summary 2024',
    type: 'Financial',
    date: '2024-03-31',
    data: {},
    status: 'Generated'
  }
];

export default function ReportList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchReports() {
      if (!user) {
        setReports(EXAMPLE_REPORTS);
        setIsLoading(false);
        return;
      }

      try {
        const userReports = await getUserReports(user.uid);
        setReports([...EXAMPLE_REPORTS, ...userReports]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [user, toast]);

  const handleReportCreated = async (newReport: Omit<Report, 'id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to create reports",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdReport = await createReport(user.uid, newReport);
      setReports(prev => [...prev, createdReport]);
      toast({
        title: "Success",
        description: "Report created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-600">View and generate project reports</p>
        </div>
        <CreateReportDialog onReportCreated={handleReportCreated} />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${report.status === 'Generated' ? 'bg-green-100 text-green-800' :
                      report.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 