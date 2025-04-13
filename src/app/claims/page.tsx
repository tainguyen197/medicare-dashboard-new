import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ServerNavBar } from "@/components/ServerNavBar";
import { Footer } from "@/components/Footer";

// Mock claims data
const mockClaims = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Smith",
    providerName: "General Hospital",
    serviceDate: "2023-12-15",
    submissionDate: "2023-12-18",
    amount: 1250.75,
    status: "Approved",
    claimNumber: "MC-2023-001",
    description: "Routine checkup and blood tests",
    documentUrl: "/documents/claim-1.pdf",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Jane Doe",
    providerName: "Medical Center",
    serviceDate: "2024-01-05",
    submissionDate: "2024-01-07",
    amount: 3425.5,
    status: "Pending",
    claimNumber: "MC-2024-002",
    description: "MRI scan and specialist consultation",
    documentUrl: "/documents/claim-2.pdf",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Robert Johnson",
    providerName: "City Healthcare",
    serviceDate: "2024-02-10",
    submissionDate: "2024-02-12",
    amount: 875.25,
    status: "Denied",
    claimNumber: "MC-2024-003",
    description: "Physical therapy session",
    documentUrl: "/documents/claim-3.pdf",
  },
  {
    id: "4",
    patientId: "4",
    patientName: "Mary Williams",
    providerName: "Community Hospital",
    serviceDate: "2024-03-01",
    submissionDate: "2024-03-03",
    amount: 2150.0,
    status: "Approved",
    claimNumber: "MC-2024-004",
    description: "Cataract surgery",
    documentUrl: "/documents/claim-4.pdf",
  },
  {
    id: "5",
    patientId: "5",
    patientName: "David Brown",
    providerName: "Senior Care Clinic",
    serviceDate: "2024-03-10",
    submissionDate: "2024-03-12",
    amount: 550.75,
    status: "Under Review",
    claimNumber: "MC-2024-005",
    description: "Annual wellness visit",
    documentUrl: "/documents/claim-5.pdf",
  },
];

export default function ClaimsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ServerNavBar currentPath="/claims" />

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Claims
            </h1>
            <Button>Submit New Claim</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Total Claims
                </div>
                <div className="text-3xl font-bold mt-2 dark:text-white">
                  148
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Approved
                </div>
                <div className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
                  86
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Pending
                </div>
                <div className="text-3xl font-bold mt-2 text-yellow-600 dark:text-yellow-400">
                  42
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Denied
                </div>
                <div className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">
                  20
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3">Claim #</th>
                      <th className="px-6 py-3">Patient</th>
                      <th className="px-6 py-3">Provider</th>
                      <th className="px-6 py-3">Service Date</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockClaims.map((claim) => (
                      <tr
                        key={claim.id}
                        className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 font-medium">
                          <Link
                            href={`/claims/${claim.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {claim.claimNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/patients/${claim.patientId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {claim.patientName}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{claim.providerName}</td>
                        <td className="px-6 py-4">{claim.serviceDate}</td>
                        <td className="px-6 py-4">
                          ${claim.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              claim.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : claim.status === "Pending" ||
                                  claim.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button
                              href={`/claims/${claim.id}`}
                              variant="outline"
                              size="sm"
                            >
                              View
                            </Button>
                            <Button
                              href={claim.documentUrl}
                              variant="outline"
                              size="sm"
                            >
                              Document
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
