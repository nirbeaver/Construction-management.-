"use client";

import { useState } from "react";
import { X, FileText, Download, Calendar, User, MessageSquare } from "lucide-react";

interface ViewDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

interface DocumentDetails {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
  subCategory: string;
  description?: string;
  url: string;
  attachments?: Array<{
    name: string;
    size: string;
    url: string;
  }>;
  comments?: Array<{
    user: string;
    text: string;
    date: string;
  }>;
}

export default function ViewDocumentDialog({
  isOpen,
  onClose,
  document,
}: ViewDocumentDialogProps) {
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  if (!isOpen || !document) return null;

  const handleViewDocument = () => {
    // Open document in a popup window
    const width = 800;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Create a viewer URL based on the document type
    const viewerUrl = document.type?.toLowerCase().includes('pdf') 
      ? document.url  // For PDFs, use direct URL
      : `https://docs.google.com/viewer?url=${encodeURIComponent(document.url)}&embedded=true`; // For other documents

    window.open(
      viewerUrl,
      'DocumentViewer',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
  };

  const handleAttachmentView = (attachmentUrl: string) => {
    const width = 800;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Use Google Docs Viewer for non-PDF files
    const viewerUrl = attachmentUrl.toLowerCase().endsWith('.pdf')
      ? attachmentUrl
      : `https://docs.google.com/viewer?url=${encodeURIComponent(attachmentUrl)}&embedded=true`;

    window.open(
      viewerUrl,
      'AttachmentViewer',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{document.name}</h2>
              <p className="text-sm text-gray-600">{document.size}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Document Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Uploaded By</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{document.uploadedBy}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Upload Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{document.uploadedAt}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <span>{document.category}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Sub-Category</p>
              <span>{document.subCategory}</span>
            </div>
          </div>

          {document.description && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-sm">{document.description}</p>
            </div>
          )}

          {document.comments && document.comments.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Comments</p>
              <div className="space-y-3">
                {document.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{comment.user}</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {document.attachments && document.attachments.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Attachments</p>
              <div className="space-y-2">
                {document.attachments.map((attachment, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-gray-500">{attachment.size}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAttachmentView(attachment.url)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleViewDocument}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            View Document
          </button>
        </div>
      </div>
    </div>
  );
} 