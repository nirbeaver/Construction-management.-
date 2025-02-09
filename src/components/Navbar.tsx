'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Construction Management
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="ghost">Projects</Button>
              </Link>
              <Link href="/properties">
                <Button variant="ghost">Properties</Button>
              </Link>
              <Link href="/reports">
                <Button variant="ghost">Reports</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 