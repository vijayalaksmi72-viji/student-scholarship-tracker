# 🎓 Student Scholarship Application and Disbursement Tracker

A full-stack web application built for **SIH 2026 (Internal Assessment)** that allows a scholarship
cell / administrator to track scholarship applications end-to-end — from submission, through review
and approval, to final fund disbursement.

---

## 📌 Project Description

Managing scholarship applications on spreadsheets is error-prone and hard to audit: names get
duplicated, records go missing, and nobody can tell how long an application has actually been
pending. This project replaces that process with a proper full-stack application:

- A single dashboard shows **every** application with its current stage, requested/sanctioned
  amount, and how many days it has been waiting.
- Officers can **search** by student name or application ID, and **filter** by stage
  (Submitted / Under Review / Approved / Disbursed / Rejected).
- New applications can be **added**, existing ones **edited**, and every write is validated on the
  server before it touches the database.
- The sample dataset intentionally includes **duplicate student names**, **missing fields**
  (email, phone, amounts, category), and **old application dates**, so the UI can be judged on how
  gracefully it handles real-world messy data — exactly the scenario the problem statement asks
  reviewers to test.

---

## 🛠 Technology Stack

| Layer            | Technology                                    |
|------------------|------------------------------------------------|
| Frontend         | React 18 (Vite), HTML5, CSS3, JavaScript (ES6) |
| Routing          | React Router v6                                |
| HTTP client      | Axios                                          |
| Icons            | lucide-react                                   |
| Backend          | Node.js, Express.js                            |
| Database         | SQLite (via `better-sqlite3`)                  |
| API testing      | Jest + Supertest                               |
| E2E testing      | Playwright                                     |

---

## 📂 Folder Structure

```
student-scholarship-tracker/
├── README.md
├── .gitignore
│
├── database/
│   ├── schema.sql          # Table definition
│   └── seed.sql            # 20 sample records (duplicates + missing values + old dates)
│                            # scholarship.db is auto-created here on first backend run
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js            # Express app entry point
│   ├── db.js                # SQLite connection + auto schema/seed loader
│   ├── routes/
│   │   └── applications.js
│   ├── controllers/
│   │   └── applicationsController.js
│   ├── middleware/
│   │   └── validate.js      # Server-side validation
│   ├── utils/
│   │   └── daysWaiting.js   # "Days Waiting" calculation
│   └── tests/
│       └── api.test.js      # Jest + Supertest API/E2E tests
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── playwright.config.js
    ├── index.html
    ├── public/
    │   └── favicon.svg
    ├── e2e/
    │   └── dashboard.spec.js   # Playwright end-to-end UI tests
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── api.js           # Axios service layer
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── AddApplication.jsx
        │   └── EditApplication.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── SearchBar.jsx
        │   ├── FilterDropdown.jsx
        │   ├── ApplicationTable.jsx
        │   ├── ApplicationForm.jsx
        │   ├── Loading.jsx
        │   ├── ErrorState.jsx
        │   └── EmptyState.jsx
        └── styles/
            ├── index.css
            ├── layout.css
            ├── navbar.css
            ├── sidebar.css
            ├── searchbar.css
            ├── filterdropdown.css
            ├── states.css
            ├── table.css
            ├── form.css
            └── dashboard.css
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### 1. Clone / unzip the project
```bash
cd student-scholarship-tracker
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 4. Run the backend
```bash
cd ../backend
npm start
```
The API starts on **http://localhost:5000**. On first launch it automatically creates
`database/scholarship.db`, applies `schema.sql`, and loads the 20 sample records from `seed.sql`.
You should see:
```
✅ Scholarship Tracker API running on http://localhost:5000
```

### 5. Run the frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
The app opens on **http://localhost:5173** (Vite proxies `/api` calls to the backend on port 5000,
configured in `vite.config.js`).

### 6. Run backend tests
```bash
cd backend
npm test
```
Runs 15 Jest + Supertest tests covering health check, search, filter, create, read, update,
delete, and validation error paths.

### 7. Run frontend E2E tests (optional)
Playwright needs to download a browser binary once, which requires open internet access from
your machine (this step could not be completed inside the sandboxed environment this project was
built in, so please run it yourself):
```bash
cd frontend
npx playwright install chromium
npm run dev            # keep this running in one terminal
npm run test:e2e        # in a second terminal (with the backend also running)
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint                | Description                                   |
|--------|--------------------------|------------------------------------------------|
| GET    | `/applications`          | List all applications. Supports `?search=`, `?stage=`, `?category=` query params |
| GET    | `/applications/:id`      | Get a single application by numeric id or application_id |
| POST   | `/applications`          | Create a new application (server-validated)    |
| PUT    | `/applications/:id`      | Update an existing application (server-validated) |
| DELETE | `/applications/:id`      | Delete an application                          |
| GET    | `/health`                | Health check                                   |

### Sample response — `GET /api/applications?search=Aarav`
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 4,
      "application_id": "SCH-2026-004",
      "student_name": "Aarav Sharma",
      "email": "aarav.sharma2@example.com",
      "phone": null,
      "scholarship_name": "Minority Welfare Scholarship",
      "category": "Minority",
      "amount_requested": 40000,
      "amount_sanctioned": null,
      "stage": "Submitted",
      "applied_date": "2026-07-01",
      "last_updated": "2026-07-01",
      "remarks": null,
      "days_waiting": 25
    }
  ]
}
```

### Validation error example — `POST /api/applications` with missing fields
```json
{
  "success": false,
  "errors": [
    "Student name is required.",
    "Scholarship name is required.",
    "Applied date is required."
  ]
}
```

---

## ✅ Features Implemented

- [x] 20 sample scholarship records with duplicate student names
- [x] Records with missing values (null email, phone, amounts, category, scholarship name)
- [x] Old application dates to validate the "Days Waiting" calculation
- [x] Responsive, sortable data table
- [x] Search by student name / application ID (debounced, server-side)
- [x] Filter by stage (server-side)
- [x] Add new application with client + server validation
- [x] Edit existing application with client + server validation
- [x] Auto-calculated "Days Waiting" (freezes once a record reaches Disbursed/Rejected)
- [x] Loading state (spinner)
- [x] Empty state (no records at all) vs. "no matching records" state (search/filter with 0 hits)
- [x] Record-not-found state (editing a deleted/invalid id)
- [x] Error state with retry button (server/network failure)
- [x] Delete with confirmation modal
- [x] SQLite persistence — data survives server restarts
- [x] 15 passing backend API tests (Jest + Supertest)
- [x] Playwright end-to-end UI test suite

---

## 📸 Screenshots

> Add screenshots here after running the app locally, e.g.:
>
> ![Dashboard](screenshots/dashboard.png)
> ![Add Application](screenshots/add-application.png)
> ![Edit Application](screenshots/edit-application.png)
> ![Empty State](screenshots/empty-state.png)

---

## 🔮 Future Enhancements

- Role-based authentication (Admin / Reviewer / Student login)
- Bulk import of applications via CSV upload
- Email/SMS notifications on stage change
- Export filtered results to PDF/Excel
- Pagination and column sorting for very large datasets
- Audit log of who changed what and when
- Dashboard analytics (charts for disbursement trends by category/month)
- Dark mode

---

## 🧾 Git Commands

```bash
git init
git add .
git commit -m "Initial commit: Student Scholarship Application and Disbursement Tracker"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 📤 GitHub Upload Steps

1. Create a new empty repository on GitHub (do not initialize with a README).
2. Copy the repository's HTTPS/SSH URL.
3. In your project's root folder, run the Git commands above, replacing
   `<your-github-repo-url>` with the URL you copied.
4. Refresh the GitHub page — your code should now be visible.
5. Optionally add topics (`sih2026`, `react`, `express`, `sqlite`) and a project description in
   the repo's "About" section.

---

## 🎥 Video Demonstration Script (suggested, ~3 minutes)

1. **Intro (15s)** — State the problem statement and what the app solves.
2. **Dashboard (30s)** — Show the 20 seeded records, point out duplicate names and missing fields,
   highlight the stat cards and the "Days Waiting" column.
3. **Search & Filter (30s)** — Search "Sharma" to show duplicate handling; filter by "Disbursed" to
   show stage filtering.
4. **Add Application (30s)** — Click "Add Application", submit an incomplete form to show
   validation errors, then fill it correctly and save.
5. **Edit Application (30s)** — Edit a record's stage from "Under Review" to "Approved" and show it
   reflected instantly on the dashboard.
6. **Error/Empty/Not-Found states (30s)** — Search for a non-existent student to show the empty
   state; navigate to `/edit/999999` to show the not-found state; (optionally) stop the backend to
   show the error state with a retry button.
7. **Delete (15s)** — Delete the test record created earlier, with the confirmation modal.
8. **Wrap-up (10s)** — Mention the tech stack and that all data persists in SQLite.

---

## 📝 License

Built as an academic project for SIH 2026 Internal Assessment. Free to use and modify for
educational purposes.
