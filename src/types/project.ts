export interface Project {
  id: string;
  name: string;
  description: string;
  customerName: string;
  companyName?: string;
  address: string;
  contactPhones: string[];
  contactEmails: string[];
  location: string;
  startDate: string;
  duration: string;
  durationType: 'days' | 'weeks';
  estimatedEndDate: string;
  budget: number;
  estimatedCost: number;
  status?: string;
  spent?: number;
  documents?: string[];
} 