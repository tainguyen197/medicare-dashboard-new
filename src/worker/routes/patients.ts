import { Hono } from "hono";

// Type for environment bindings
type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
};

// Create a new Hono app for patient routes
const patients = new Hono<{ Bindings: Bindings }>();

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
  },
];

// Get all patients
patients.get("/", (c) => {
  // In a real application, this would fetch from the database
  return c.json(mockPatients);
});

// Get a specific patient by ID
patients.get("/:id", (c) => {
  const id = c.req.param("id");
  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  return c.json(patient);
});

// Create a new patient (mock)
patients.post("/", async (c) => {
  try {
    const body = await c.req.json();

    // In a real application, this would insert into the database
    // and return the newly created patient

    return c.json(
      {
        id: "4",
        ...body,
      },
      201
    );
  } catch (error) {
    console.error("Create patient error:", error);
    return c.json({ error: "Failed to create patient" }, 500);
  }
});

// Update a patient (mock)
patients.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    // In a real application, this would update the database

    return c.json({
      id,
      ...body,
    });
  } catch (error) {
    console.error("Update patient error:", error);
    return c.json({ error: "Failed to update patient" }, 500);
  }
});

// Delete a patient (mock)
patients.delete("/:id", (c) => {
  const id = c.req.param("id");

  // In a real application, this would delete from the database

  return c.json({ message: `Patient with ID ${id} deleted successfully` });
});

export { patients };
