"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookAIcon, Users } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path) || false;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              Dashboard
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4">
          <nav className="space-y-1">
            <li className="list-none">
              <Link
                href="/users"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive("/dashboard/users")
                    ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>User</span>
              </Link>
            </li>
            <li className="list-none">
              <Link
                href="/blogs"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive("/dashboard/blogs")
                    ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <BookAIcon className="w-5 h-5 mr-3" />
                <span>Blogs</span>
              </Link>
            </li>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
