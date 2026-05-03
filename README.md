# Patient Service (Microservice)

This is the **Patient Service** of the Hospital Management System built using a microservices architecture. It handles all operations related to patient data.


## a. Patient Service
•	Perform CRUD operations for patient records.
•	Enable search functionality by name or phone number.
•	Ensure masking of personally identifiable information (PII) in logs.

---

##  Features

* Perform **CRUD operations** for patient records
* **Search patients** by name or phone number
*  **Pagination support** for listing patients
*  **PII masking in logs** (email and phone are masked)
* **Standard error handling** with correlation IDs

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* Prisma ORM
* MySQL



##  API Endpoints

###  Health Check

```
GET /v1/health
```

---

###  Create Patient

```
POST /v1/patients
```

---

###  Get All Patients (Search + Pagination)

```
GET /v1/patients?search=&page=1&size=10
```

---

###  Get Patient by ID

```
GET /v1/patients/{id}
```

---

###  Update Patient

```
PUT /v1/patients/{id}
```

---

###  Delete Patient

```
DELETE /v1/patients/{id}
```

---

## 🔒 PII Masking

Sensitive data like email and phone numbers are masked in logs:

* Email → `ab****@mail.com`
* Phone → `98******10`




## 📌 Notes

* Uses **database-per-service architecture**
* No shared tables with other services
* Designed for scalability and loose coupling




