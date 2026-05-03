const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

/* Health Check */
app.get("/v1/health", (req, res) => {
  res.json({ status: "OK" });
});

/* 🔒 PII Masking */
function maskEmail(email) {
  if (!email) return "";
  return email.replace(/(.{2}).+(@.+)/, "$1****$2");
}

function maskPhone(phone) {
  if (!phone) return "";
  return phone.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2");
}

/* ❌ Error Handler */
function handleError(res, err, code) {
  console.error("Error:", err.message);

  if (err.code === "P2002") {
    return res.status(400).json({
      code: "DUPLICATE_ENTRY",
      message: "Email or phone already exists",
      correlationId: Date.now().toString(),
    });
  }

  res.status(500).json({
    code,
    message: err.message,
    correlationId: Date.now().toString(),
  });
}

/* ✅ Create Patient */
app.post("/v1/patients", async (req, res) => {
  try {
    const { name, email, phone, dob } = req.body;

    // ✅ Validation INSIDE API
    if (!name || !email || !phone || !dob) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "All fields are required",
        correlationId: Date.now().toString(),
      });
    }

    console.log("Creating patient:", {
      name,
      email: maskEmail(email),
      phone: maskPhone(phone),
    });

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
    handleError(res, err, "CREATE_FAILED");
  }
});

/* ✅ GET Patients (Search + Pagination) */
app.get("/v1/patients", async (req, res) => {
  try {
    let { search = "", page = 1, size = 10 } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    const whereCondition = {
      OR: [
        { name: { contains: search } },
        { phone: { contains: search } },
      ],
    };

    const total = await prisma.patient.count({ where: whereCondition });

    const patients = await prisma.patient.findMany({
      where: whereCondition,
      skip: (page - 1) * size,
      take: size,
      orderBy: { created_at: "desc" },
    });

    res.json({
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      data: patients,
    });
  } catch (err) {
    handleError(res, err, "FETCH_FAILED");
  }
});

app.listen(3001, () => {
  console.log("Patient Service running on port 3001");
});