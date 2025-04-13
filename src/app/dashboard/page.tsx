"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold dark:text-white">124</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500 dark:text-green-400">
                    ↑ 12%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold dark:text-white">38</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-red-500 dark:text-red-400">↓ 5%</span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold dark:text-white">
                  $52,489
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-500 dark:text-green-400">
                    ↑ 8%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y dark:divide-gray-700">
                  {[
                    {
                      id: "1",
                      name: "John Smith",
                      date: "2024-03-15",
                      status: "Active",
                    },
                    {
                      id: "2",
                      name: "Jane Doe",
                      date: "2024-03-10",
                      status: "Active",
                    },
                    {
                      id: "3",
                      name: "Robert Johnson",
                      date: "2024-03-05",
                      status: "Inactive",
                    },
                    {
                      id: "4",
                      name: "Mary Williams",
                      date: "2024-02-28",
                      status: "Active",
                    },
                  ].map((patient) => (
                    <div
                      key={patient.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium dark:text-white">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Added on {patient.date}
                        </div>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            patient.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button href="/patients" variant="outline" size="sm">
                    View All Patients
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y dark:divide-gray-700">
                  {[
                    {
                      id: "1",
                      patientName: "John Smith",
                      amount: "$1,250.75",
                      status: "Approved",
                    },
                    {
                      id: "2",
                      patientName: "Jane Doe",
                      amount: "$3,425.50",
                      status: "Pending",
                    },
                    {
                      id: "3",
                      patientName: "Robert Johnson",
                      amount: "$875.25",
                      status: "Denied",
                    },
                    {
                      id: "4",
                      patientName: "Mary Williams",
                      amount: "$2,150.00",
                      status: "Approved",
                    },
                  ].map((claim) => (
                    <div
                      key={claim.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium dark:text-white">
                          {claim.patientName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {claim.amount}
                        </div>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            claim.status === "Approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : claim.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button href="/claims" variant="outline" size="sm">
                    View All Claims
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
