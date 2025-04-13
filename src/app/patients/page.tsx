import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ServerNavBar } from "@/components/ServerNavBar";
import { Footer } from "@/components/Footer";

// Mock patient data
const mockPatients = [
  {
    id: "1",
    name: "John Smith",
    dateOfBirth: "1945-03-12",
    medicareNumber: "1234567890",
    phoneNumber: "555-123-4567",
    email: "john.smith@example.com",
    address: "123 Main St, Anytown, USA",
    insuranceProvider: "Medicare Part A & B",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Doe",
    dateOfBirth: "1952-08-24",
    medicareNumber: "0987654321",
    phoneNumber: "555-987-6543",
    email: "jane.doe@example.com",
    address: "456 Oak Ave, Somewhere, USA",
    insuranceProvider: "Medicare Advantage",
    status: "Active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    dateOfBirth: "1940-11-05",
    medicareNumber: "5678901234",
    phoneNumber: "555-456-7890",
    email: "robert.johnson@example.com",
    address: "789 Pine St, Elsewhere, USA",
    insuranceProvider: "Medicare Part D",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Mary Williams",
    dateOfBirth: "1948-07-18",
    medicareNumber: "9876543210",
    phoneNumber: "555-789-0123",
    email: "mary.williams@example.com",
    address: "321 Elm St, Nowhere, USA",
    insuranceProvider: "Medicare Part A & B",
    status: "Active",
  },
  {
    id: "5",
    name: "David Brown",
    dateOfBirth: "1937-12-01",
    medicareNumber: "1357924680",
    phoneNumber: "555-321-6547",
    email: "david.brown@example.com",
    address: "654 Cedar Ln, Anytown, USA",
    insuranceProvider: "Medicare Advantage",
    status: "Active",
  },
];

export default function PatientsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ServerNavBar currentPath="/patients" />

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Patients
            </h1>
            <Button>Add New Patient</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Medicare #</th>
                      <th className="px-6 py-3">Date of Birth</th>
                      <th className="px-6 py-3">Insurance</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 font-medium">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {patient.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{patient.medicareNumber}</td>
                        <td className="px-6 py-4">{patient.dateOfBirth}</td>
                        <td className="px-6 py-4">
                          {patient.insuranceProvider}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              patient.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button
                              href={`/patients/${patient.id}`}
                              variant="outline"
                              size="sm"
                            >
                              View
                            </Button>
                            <Button
                              href={`/patients/${patient.id}/edit`}
                              variant="outline"
                              size="sm"
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
