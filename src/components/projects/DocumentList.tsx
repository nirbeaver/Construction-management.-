"use client";

import { useState } from "react";
import { FileText, Download, Trash2, Eye, Edit, Upload, FolderOpen } from "lucide-react";
import UploadDocumentDialog from "./UploadDocumentDialog";
import ViewDocumentDialog from "./ViewDocumentDialog";
import EditDocumentDialog from "./EditDocumentDialog";

type DocumentCategory = "owner" | "construction" | "subcontractor";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: DocumentCategory;
  subCategory: string;
  description?: string;
  url?: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
  }>;
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
    id: 1,
    name: "Construction Contract.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-15",
    category: "owner",
    subCategory: "Contract",
    url: "https://example.com/path/to/contract.pdf",
    attachments: [
      {
        id: "1",
        name: "Attachment 1.pdf",
        size: "1.2 MB",
        url: "https://example.com/path/to/attachment1.pdf"
      }
    ]
  },
  {
    id: 2,
    name: "Foundation Plans.pdf",
    type: "PDF",
    size: "5.6 MB",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2024-01-25",
    category: "construction",
    subCategory: "Engineering Plans",
    url: "https://example.com/path/to/plans.pdf",
    attachments: [
      {
        id: "2",
        name: "Structural Details.pdf",
        size: "2.1 MB",
        url: "https://example.com/path/to/details.pdf"
      }
    ]
  },
];

export default function DocumentList({ projectId }: { projectId: string }) {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleAddDocument = (newDocument: Omit<Document, 'id'>) => {
    const document: Document = {
      ...newDocument,
      id: documents.length + 1,
    };
    setDocuments(prev => [document, ...prev]);
  };

  const handleUpdateDocument = (updatedDocument: Document) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === updatedDocument.id ? updatedDocument : doc
      )
    );
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Project Documents</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'all')}
            className="rounded-lg border border-gray-300 text-sm"
          >
            <option value="all">All Documents</option>
            {Object.entries(DOCUMENT_CATEGORIES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsUploadDialogOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Upload className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
                        {DOCUMENT_CATEGORIES[doc.category].label}
                      </span>
                      <span className="text-gray-500">{doc.subCategory}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedDocument(doc);
                        setIsViewDialogOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedDocument(doc);
                        setIsEditDialogOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                      title="Edit Document"
                    >
                      <Edit className="h-5 w-5" />
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

      <UploadDocumentDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleAddDocument}
        categories={DOCUMENT_CATEGORIES}
      />

      <ViewDocumentDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
      />

      <EditDocumentDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateDocument}
        document={selectedDocument}
        categories={DOCUMENT_CATEGORIES}
      />
    </>
  );
} 