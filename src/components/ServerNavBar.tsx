import Link from "next/link";

interface ServerNavBarProps {
  currentPath: string;
}

export function ServerNavBar({ currentPath }: ServerNavBarProps) {
  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-semibold text-gray-800 dark:text-white"
        >
          Admin Dashboard
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/users"
                className={`text-sm font-medium transition-colors ${
                  isActive("/users")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
