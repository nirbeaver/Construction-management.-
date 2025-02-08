"use client";

import { useState } from "react";
import { FileText, Download, Trash2, Eye, Upload, FolderOpen } from "lucide-react";

type DocumentCategory = "insurance" | "vehicle" | "office" | "professional" | "licenses" | "software";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: DocumentCategory;
  subcategory: string;
  description?: string;
}

// Mock data
const MOCK_DOCUMENTS: Document[] = [
  {
    id: 1,
    name: "Liability Insurance Policy.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "2024-02-15",
    category: "insurance",
    subcategory: "Liability",
    description: "Annual liability insurance policy document",
  },
  {
    id: 2,
    name: "Vehicle Lease Agreement.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "2024-01-20",
    category: "vehicle",
    subcategory: "Lease",
    description: "Company vehicle lease agreement",
  },
];

export default function ExpenseDocuments() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Documents</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'all')}
            className="rounded-lg border border-gray-300 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="insurance">Insurance</option>
            <option value="vehicle">Vehicle</option>
            <option value="office">Office</option>
            <option value="professional">Professional</option>
            <option value="licenses">Licenses & Permits</option>
            <option value="software">Software</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <Upload className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{doc.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{doc.uploadedAt}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100">
                        {doc.category}
                      </span>
                      <span className="text-gray-500">{doc.subcategory}</span>
                    </div>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mt-2">{doc.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                      title="View"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 