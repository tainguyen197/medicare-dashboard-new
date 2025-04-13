import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme/ThemeToggle";

export function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Medicare Dashboard
        </Link>
        <div className="flex items-center">
          <nav className="mr-4">
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
                <Link href="/logout" className="hover:underline">
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
