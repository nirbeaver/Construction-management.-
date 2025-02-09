"use client";

import { Building, MapPin, Ruler } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import { CreatePropertyDialog } from "./CreatePropertyDialog";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getUserProperties, createProperty } from "@/lib/firebase/firebaseUtils";
import { useToast } from "@/components/ui/use-toast";

const EXAMPLE_PROPERTIES: Property[] = [
  {
    id: "example-1",
    name: "Luxury Apartment Complex",
    address: "123 Main St, City, State 12345",
    type: "Residential",
    status: "Under Construction",
    size: 50000,
    sizeUnit: "sqft",
    price: 5000000,
    description: "Modern luxury apartment complex with 100 units",
    features: ["Pool", "Gym", "Security"],
    images: [],
    documents: []
  },
  // Add more example properties...
];

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProperties() {
      if (!user) {
        setProperties(EXAMPLE_PROPERTIES);
        setIsLoading(false);
        return;
      }

      try {
        const userProperties = await getUserProperties(user.uid);
        setProperties([...EXAMPLE_PROPERTIES, ...userProperties]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load properties");
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, [user, toast]);

  const handlePropertyCreated = async (newProperty: Omit<Property, 'id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to create properties",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdProperty = await createProperty(user.uid, newProperty);
      setProperties(prev => [...prev, createdProperty]);
      toast({
        title: "Success",
        description: "Property created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-gray-600">Manage your real estate portfolio</p>
        </div>
        <CreatePropertyDialog onPropertyCreated={handlePropertyCreated} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/properties/${property.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm 
                  ${property.status === 'Active' ? 'bg-green-100 text-green-800' :
                    property.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                    property.status === 'For Sale' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}`}
                >
                  {property.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Value</p>
                <p className="text-lg font-semibold">${property.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="h-5 w-5" />
                <span>{property.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Ruler className="h-5 w-5" />
                <span>{property.size.toLocaleString()} {property.sizeUnit}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{property.address}</span>
              </div>
            </div>

            {property.features.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Link>
        ))}

        {properties.length === 0 && (
          <div className="text-center py-8 text-gray-500 col-span-full">
            No properties yet. Click "New Property" to create one.
          </div>
        )}
      </div>
    </div>
  );
} 