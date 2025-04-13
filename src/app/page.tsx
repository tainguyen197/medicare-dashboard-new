import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Medicare Dashboard</h1>
          <div className="flex items-center space-x-4">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/patients" className="hover:underline">
                    Patients
                  </Link>
                </li>
                <li>
                  <Link href="/claims" className="hover:underline">
                    Claims
                  </Link>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Welcome to Medicare Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              A modern, edge-first fullstack web application built with Next.js
              15. Combining the power of Cloudflare Workers, Turso database, and
              R2 storage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  Patient Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Track and manage patient information with our intuitive
                  interface.
                </p>
                <Link
                  href="/patients"
                  className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  View Patients
                </Link>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  Claims Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Efficiently process and track Medicare claims status.
                </p>
                <Link
                  href="/claims"
                  className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  Manage Claims
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
