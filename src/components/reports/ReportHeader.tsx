"use client";

import { Download, Share2, Printer, Filter } from "lucide-react";

export default function ReportHeader() {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
          <p className="text-gray-600">Generate detailed financial reports and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 className="h-5 w-5" />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer className="h-5 w-5" />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
} 