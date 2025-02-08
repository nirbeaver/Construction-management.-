import { Timestamp } from 'firebase/firestore';

// User Profile
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'manager' | 'user';
  company?: string;
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Project
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  customerName: string;
  companyName?: string;
  address: string;
  contactPhones: string[];
  contactEmails: string[];
  startDate: Timestamp;
  estimatedEndDate: Timestamp;
  actualEndDate?: Timestamp;
  budget: number;
  estimatedCost: number;
  actualCost: number;
  ownerId: string; // User who created the project
  teamMembers: string[]; // Array of user IDs
  documents: DocumentReference[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Document
export interface DocumentReference {
  id: string;
  name: string;
  type: 'blueprint' | 'permit' | 'contract' | 'invoice' | 'report' | 'other';
  category: string;
  url: string;
  fileType: string;
  size: number;
  uploadedBy: string; // User ID
  projectId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Transaction
export interface Transaction {
  id: string;
  projectId: string;
  type: 'income' | 'expense';
  category: string;
  subcategory: string;
  amount: number;
  description: string;
  date: Timestamp;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  attachments: string[]; // Array of document URLs
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Task
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[]; // Array of user IDs
  dueDate: Timestamp;
  completedAt?: Timestamp;
  attachments: string[]; // Array of document URLs
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Comment
export interface Comment {
  id: string;
  projectId: string;
  taskId?: string; // Optional, if comment is on a task
  content: string;
  attachments: string[]; // Array of document URLs
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Milestone
export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completedAt?: Timestamp;
  status: 'pending' | 'completed' | 'overdue';
  attachments: string[]; // Array of document URLs
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 