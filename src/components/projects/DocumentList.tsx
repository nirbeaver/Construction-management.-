"use client";

import { useState } from "react";
import { FileText, Download, Trash2, Eye, Edit, Upload, FolderOpen } from "lucide-react";
import UploadDocumentDialog from "./UploadDocumentDialog";
import ViewDocumentDialog from "./ViewDocumentDialog";
import EditDocumentDialog from "./EditDocumentDialog";
import { Button } from '@/components/ui/button';

type DocumentCategory = "owner" | "construction" | "subcontractor";

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  type: string;
  category: string;
}

interface DocumentListProps {
  documents: Document[];
  onView: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

const DOCUMENT_CATEGORIES = {
  owner: {
    label: "Owner Documents",
    subCategories: [
      "Contract",
      "Change Orders",
      "Payment Applications",
      "Correspondence",
      "Insurance",
      "Other",
    ],
  },
  construction: {
    label: "Construction Documents",
    subCategories: [
      "Blueprints",
      "Engineering Plans",
      "Permits",
      "Inspections",
      "Shop Drawings",
      "Specifications",
      "Structural Engineering",
      "Survey",
      "Deputy Inspection",
      "Other",
    ],
  },
  subcontractor: {
    label: "Subcontractor Documents",
    subCategories: [
      "Contracts",
      "Change Orders",
      "Submittals",
      "Insurance Certificates",
      "Payment Applications",
      "Other",
    ],
  },
} as const;

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Construction Contract.pdf",
    uploadDate: "2024-01-15",
    size: "2.4 MB",
    type: "PDF",
    category: "owner",
  },
  {
    id: "2",
    name: "Foundation Plans.pdf",
    uploadDate: "2024-01-25",
    size: "5.6 MB",
    type: "PDF",
    category: "construction",
  },
];

export function DocumentList({ documents, onView, onDownload, onDelete }: DocumentListProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Documents');

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory('All Documents')}
          className={`text-sm font-medium ${
            selectedCategory === 'All Documents'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Documents
        </button>
        <button
          onClick={() => setSelectedCategory('Owner Documents')}
          className={`text-sm font-medium ${
            selectedCategory === 'Owner Documents'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Owner Documents
        </button>
        <button
          onClick={() => setSelectedCategory('Construction Documents')}
          className={`text-sm font-medium ${
            selectedCategory === 'Construction Documents'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Construction Documents
        </button>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <FileText className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-medium">{doc.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{doc.uploadDate}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.category}</span>
                  <span>•</span>
                  <span>{doc.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(doc)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDownload(doc)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(doc)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 