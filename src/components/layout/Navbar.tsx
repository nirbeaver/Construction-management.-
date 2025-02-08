"use client";

import { Building2, Home, PieChart, Receipt } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Building2 },
  { name: "Office Expenses", href: "/office-expenses", icon: Receipt },
  { name: "Reports", href: "/reports", icon: PieChart },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Construction PM</h1>
      </div>
      
      <div className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 