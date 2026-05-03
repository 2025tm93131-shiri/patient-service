const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

/* Health Check */
app.get("/v1/health", (req, res) => {
  res.json({ status: "OK" });
});

/* Create Patient */
app.post("/v1/patients", async (req, res) => {
  try {
    const { name, email, phone, dob } = req.body;

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone,
        dob: new Date(dob),
      },
    });

    res.json(patient);
  } catch (err) {
    res.status(500).json({
      code: "CREATE_FAILED",
      message: err.message,
      correlationId: Date.now().toString(),
    });
  }
});

/* Get All Patients */
app.get("/v1/patients", async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    res.json(patients);
  } catch (err) {
    res.status(500).json({
      code: "FETCH_FAILED",
      message: err.message,
      correlationId: Date.now().toString(),
    });
  }
});

app.listen(3001, () => {
  console.log("Patient Service running on port 3001");
});