'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Your App Name</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/projects">
                  <Button>Go to Projects</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-blue-600">Your App Name</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your app description goes here. Write something compelling about what your app does and why people should use it.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {user ? (
                <Link href="/projects">
                  <Button size="lg">View Your Projects</Button>
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link href="/auth/signin">
                    <Button size="lg" variant="outline">Get Started</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="lg">Sign Up Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
