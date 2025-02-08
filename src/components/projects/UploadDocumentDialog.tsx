"use client";

import { useState } from "react";
import { X, Upload, FileText } from "lucide-react";

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: any) => void;
  categories: typeof DOCUMENT_CATEGORIES;
}

export default function UploadDocumentDialog({
  isOpen,
  onClose,
  onUpload,
  categories,
}: UploadDocumentDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<DocumentCategory>("owner");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    files.forEach(file => {
      const document = {
        name: file.name,
        type: file.type,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: "Current User", // This would come from auth
        uploadedAt: new Date().toISOString().split('T')[0],
        category,
        subCategory,
        description,
      };

      onUpload(document);
    });

    // Reset form
    setFiles([]);
    setCategory("owner");
    setSubCategory("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upload Document</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500">
                  PDF, DOC, DWG up to 50MB each
                </span>
              </label>
            </div>
            {/* Display selected files */}
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">
                      ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as DocumentCategory);
                  setSubCategory("");
                }}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.entries(categories).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Category
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a sub-category</option>
                {categories[category].subCategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional details about the document"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={files.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 