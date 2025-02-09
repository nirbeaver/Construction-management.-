export interface Project {
  id: string;
  name: string;
  description: string;
  customerName: string;
  address: string;
  contactPhones: string[];
  contactEmails: string[];
  location: string;
  status: string;
  budget: number;
  estimatedCost: number;
  spent: number;
  startDate: string;
  duration: string;
  durationType: 'days' | 'weeks' | 'months';
  estimatedEndDate: string;
  documents: string[];
} 