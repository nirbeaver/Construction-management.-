'use client';

import { useAuth } from "@/lib/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/auth/')) {
      router.push('/');
    }
  }, [user, loading, router, pathname]);

  // If not authenticated and not on auth pages, show nothing (will redirect)
  if (!user && !pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <div className={`${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
      <div className="flex">
        <aside className="w-64 hidden md:block">
          <Sidebar />
        </aside>
        <main className="flex-1 min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 