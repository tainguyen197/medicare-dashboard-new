import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button href="/" size="lg">
            Go Back Home
          </Button>
          <div>
            <p className="text-sm text-gray-500 mt-8">
              Need assistance? Please{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800"
              >
                contact our support team
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
