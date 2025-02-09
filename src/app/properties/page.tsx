'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
}

export default function Properties() {
  const [properties] = useState<Property[]>([
    {
      id: '1',
      name: 'Sunset Apartments',
      address: '123 Main St, City',
      type: 'Residential',
      status: 'Active'
    },
    // Add more sample properties
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/properties/new">
          <Button>New Property</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Link key={property.id} href={`/properties/${property.id}`}>
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{property.address}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {property.type}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {property.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 