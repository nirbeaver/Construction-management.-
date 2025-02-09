export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  status: 'Active' | 'Under Construction' | 'For Sale' | 'Sold';
  size: number;
  sizeUnit: 'sqft' | 'sqm' | 'acres';
  price: number;
  description: string;
  features: string[];
  images: string[];
  documents: string[];
  projectId?: string;
} 