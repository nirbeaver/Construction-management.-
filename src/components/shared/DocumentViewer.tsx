"use client";

import { useState } from "react";
import { X, FileText } from "lucide-react";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: File;
}

export default function DocumentViewer({
  isOpen,
  onClose,
  document,
}: DocumentViewerProps) {
  const getDocumentType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'other';
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[95vw] max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{document.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
          {getDocumentType(document.name) === 'image' ? (
            <img
              src={URL.createObjectURL(document)}
              alt={document.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <iframe
              src={URL.createObjectURL(document)}
              className="w-full h-full border-0"
              title={document.name}
              style={{ minHeight: "85vh" }}
            />
          )}
        </div>
      </div>
    </div>
  );
} 