const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const results = [];

fs.createReadStream("data/hms_patients_indian.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    for (const row of results) {
      try {
        await prisma.patient.create({
          data: {
            name: row.name,
            email: row.email,
            phone: row.phone,
            dob: new Date(row.dob),
          },
        });
      } catch (err) {
        console.log("Skipping duplicate:", row.email);
      }
    }

    console.log("✅ Data inserted successfully");
    process.exit();
  });