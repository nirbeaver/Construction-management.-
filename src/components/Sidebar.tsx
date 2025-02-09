'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Building2,
  ClipboardList,
  Receipt,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from './ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      pattern: /^\/dashboard/
    },
    { 
      name: 'Projects', 
      href: '/projects', 
      icon: Building2,
      pattern: /^\/projects/
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: FileText,
      pattern: /^\/reports/
    },
    { 
      name: 'Tasks', 
      href: '/tasks', 
      icon: ClipboardList,
      pattern: /^\/tasks/
    },
    { 
      name: 'Office Expenses', 
      href: '/office-expenses', 
      icon: Receipt,
      pattern: /^\/office-expenses/
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between border-r bg-white">
      <div className="px-4 py-6">
        <Link 
          href="/dashboard" 
          className="block"
        >
          <span className="grid h-10 place-content-center rounded-lg bg-gray-100 text-sm font-medium text-gray-900">
            Construction Management
          </span>
        </Link>

        <nav className="mt-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.pattern.test(pathname);
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
} 