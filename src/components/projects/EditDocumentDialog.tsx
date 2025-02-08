"use client";

import { useState, useEffect } from "react";
import { X, FileText, Upload, Trash2 } from "lucide-react";

interface EditDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDocument: Document) => void;
  document: Document | null;
  categories: typeof DOCUMENT_CATEGORIES;
}

interface Document {
  name: string;
  category: DocumentCategory;
  subCategory: string;
  description: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  type: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
  }>;
}

export default function EditDocumentDialog({
  isOpen,
  onClose,
  onSave,
  document,
  categories,
}: EditDocumentDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("owner");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<Document['attachments']>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);

  // Load document data when dialog opens
  useEffect(() => {
    if (document) {
      setName(document.name);
      setCategory(document.category);
      setSubCategory(document.subCategory);
      setDescription(document.description || "");
      setAttachments(document.attachments || []);
      setNewAttachments([]);
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...document,
      name,
      category,
      subCategory,
      description,
    });
    onClose();
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (id: string) => {
    setAttachments(prev => prev?.filter(attachment => attachment.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold">Edit Document</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as DocumentCategory);
                setSubCategory(""); // Reset subcategory when category changes
              }}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            >
              {Object.entries(categories).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Sub-Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Category
            </label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            >
              <option value="">Select a sub-category</option>
              {categories[category].subCategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
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
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Add any additional details about the document"
            />
          </div>

          {/* File Info (Non-editable) */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">File Size</p>
              <p>{document.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Upload Date</p>
              <p>{document.uploadedAt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Uploaded By</p>
              <p>{document.uploadedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">File Type</p>
              <p>{document.type}</p>
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            
            {/* Existing Attachments */}
            {attachments && attachments.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm text-gray-600">Current Attachments:</p>
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-gray-500">{attachment.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExistingAttachment(attachment.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Attachments */}
            <div className="space-y-4">
              {newAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">New Attachments:</p>
                  {newAttachments.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewAttachment(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  multiple
                  onChange={handleAttachmentUpload}
                  className="hidden"
                  id="attachment-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="attachment-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Add Attachments
                </label>
                <span className="text-sm text-gray-500">
                  PDF, DOC, JPG up to 10MB each
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 