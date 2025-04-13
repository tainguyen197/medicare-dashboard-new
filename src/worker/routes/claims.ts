import { Hono } from "hono";

// Type for environment bindings
type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  MEDICARE_BUCKET: R2Bucket;
};

// Create a new Hono app for claims routes
const claims = new Hono<{ Bindings: Bindings }>();

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
];

// Get all claims
claims.get("/", (c) => {
  // In a real application, this would fetch from the database
  return c.json(mockClaims);
});

// Get a specific claim by ID
claims.get("/:id", (c) => {
  const id = c.req.param("id");
  const claim = mockClaims.find((cl) => cl.id === id);

  if (!claim) {
    return c.json({ error: "Claim not found" }, 404);
  }

  return c.json(claim);
});

// Create a new claim (mock)
claims.post("/", async (c) => {
  try {
    const body = await c.req.json();

    // In a real application, this would insert into the database
    // and return the newly created claim

    return c.json(
      {
        id: "4",
        ...body,
        submissionDate: new Date().toISOString().split("T")[0],
        status: "Pending",
        claimNumber: `MC-2024-00${mockClaims.length + 1}`,
      },
      201
    );
  } catch (error) {
    console.error("Create claim error:", error);
    return c.json({ error: "Failed to create claim" }, 500);
  }
});

// Update a claim (mock)
claims.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    // In a real application, this would update the database

    return c.json({
      id,
      ...body,
    });
  } catch (error) {
    console.error("Update claim error:", error);
    return c.json({ error: "Failed to update claim" }, 500);
  }
});

// Upload a document for a claim
claims.post("/:id/document", async (c) => {
  try {
    const id = c.req.param("id");
    const formData = await c.req.formData();
    const file = formData.get("document") as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const fileName = `claim-${id}-${Date.now()}.${file.name.split(".").pop()}`;

    // Upload to R2
    await c.env.MEDICARE_BUCKET.put(fileName, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Generate a signed URL (in a real app)
    // For now, return a mock URL
    return c.json({
      documentUrl: `/documents/${fileName}`,
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return c.json({ error: "Failed to upload document" }, 500);
  }
});

// Get claims for a specific patient
claims.get("/patient/:patientId", (c) => {
  const patientId = c.req.param("patientId");
  const patientClaims = mockClaims.filter(
    (claim) => claim.patientId === patientId
  );

  return c.json(patientClaims);
});

export { claims };
