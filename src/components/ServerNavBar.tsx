import Link from "next/link";

interface ServerNavBarProps {
  currentPath: string;
}

export function ServerNavBar({ currentPath }: ServerNavBarProps) {
  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Medicare Dashboard
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/dashboard"
                className={`hover:underline ${
                  isActive("/dashboard") ? "font-medium" : ""
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/patients"
                className={`hover:underline ${
                  isActive("/patients") ? "font-medium" : ""
                }`}
              >
                Patients
              </Link>
            </li>
            <li>
              <Link
                href="/claims"
                className={`hover:underline ${
                  isActive("/claims") ? "font-medium" : ""
                }`}
              >
                Claims
              </Link>
            </li>
            <li>
              <Link
                href="/users/create"
                className={`hover:underline ${
                  isActive("/users/create") ? "font-medium" : ""
                }`}
              >
                Create User
              </Link>
            </li>
            <li>
              {/* <Link href="/logout" className="hover:underline">
                Logout
              </Link> */}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
