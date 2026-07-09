# Campus Ledger
## Feature Plan

**Scope:** College management web app — single user (no login/roles), full feature set, generic pre-filled sample data with the ability to add data during a session.

**Platform:** Next.js (App Router), deployed as a hosted website with a shareable link.

**UI reference:** Sidebar navigation with grouped tabs, each tab composed of reusable `Card` sections. See `UI_LAYOUT.md` and `FEATURE_TREE.md` for the full tab-by-tab breakdown.

---

## 1. Full Feature Set

### 1.1 Dashboard
- Stat cards: enrolled students, today's attendance %, fees collected, faculty on roll
- 7-day attendance trend
- Departments/classes flagged for attention
- Recent ledger activity feed

### 1.2 Students
- Student Directory — searchable/filterable list
- Student Profile (drawer/modal):
  - Personal Details: Student ID, Admission No., Full Name, Father's Name, Mother's Name, DOB, Gender, Category, Blood Group, Aadhaar Number, Mobile Number, Email ID, Address, Photo Upload
  - Academic Details: Course, Department, Branch, Semester/Year, Section, Roll Number, Academic Session, Admission Date, Previous Qualification
- Groups & Batches: Department-wise, Course-wise, Semester-wise, Section-wise, Subject, Practical/Lab, Tutorial, Club, Sports — used as filters across Students/Attendance/Academics/Communication

### 1.3 Attendance
- Daily Attendance (attendance % shown inline)
- Subject-wise Attendance
- Monthly Report
- Leave Records

### 1.4 Academics
- Subject List
- Faculty Allocation
- Timetable
- Course Materials (Notes Upload, Assignments, Homework, Online Study Material — one card with a type filter)

### 1.5 Examinations
- Internal Marks
- Practical Marks
- Semester Results
- Grade Card
- Result Analysis

### 1.6 Fees & Ledger
- Fee Structure
- Fee Collection (Receipt Generation as an inline action)
- Due List
- Scholarship Details

### 1.7 Library
- Book Issue
- Book Return
- Fine Details

### 1.8 Communication
- SMS Notifications
- Email Notifications
- Student Notices
- Parent Notifications

### 1.9 Reports
- Student Profile, Attendance Report, Fee Report, Marksheet, ID Card, Library Card, Bonafide Certificate, Transfer Certificate, Character Certificate
- Every report is downloadable as a PDF

---

## 2. Data Strategy

- No database. Every entity (Student, AttendanceRecord, Subject, Exam, FeeEntry, Book, Notice, Group, etc.) has a TypeScript interface, shaped like a real API response.
- **Sample data:** generic, realistic-looking fixtures per entity, stored in typed files under `/data`.
- **Session state:** a single Zustand store, initialized from the fixtures, with add/update actions per entity.
- **Persistence:** the store is synced to `localStorage` on every change, and rehydrated from `localStorage` on load (falling back to the fixtures if nothing is stored yet). This means data added during a session survives a page refresh.
- **Reset:** a "Reset to Sample Data" action clears `localStorage` and reloads the original fixtures.
- **PDF generation:** reports render as structured documents and export via a client-side PDF library (`@react-pdf/renderer` recommended for precise, fixed layouts like ID cards and certificates). No backend PDF service required.

---

## 3. Step-by-Step Implementation Plan

### Phase 0 — Project Setup
1. `pnpm create next-app` — TypeScript, App Router, Tailwind
2. Install shadcn/ui and configure base theme tokens
3. Install Zustand
4. Install `@react-pdf/renderer` (or equivalent) for PDF export
5. Folder structure:
   ```
   /app/(tabs)/dashboard, students, attendance, academics, exams, fees, library, communication, reports
   /components/ui        → shared Card, StatCard, DataTable, StatusPill, FunnelChart, BarChart, Drawer, Toggle
   /components/tabs      → per-tab composed views
   /components/pdf       → PDF document templates for Reports
   /data                 → typed mock fixtures
   /store                → Zustand store(s) with localStorage persistence
   /types                → shared TS interfaces
   ```
6. ESLint/Prettier config, commit initial scaffold

### Phase 1 — Shell & Navigation
1. Sidebar component — all 9 tabs, grouped (Overview / Academics / Operations)
2. Top bar (breadcrumb + page title)
3. Real Next.js routes per tab (`/dashboard`, `/students`, etc.)
4. Base responsive layout (desktop-first)

### Phase 2 — Shared Component Library
- `Card`, `StatCard`, `DataTable`, `StatusPill`, `FunnelChart`, `BarChart`, `Drawer`/`Modal`, form inputs, `ToggleRow`

### Phase 3 — Types & Mock Data Layer
1. Define TS interfaces for every entity
2. Write generic fixture data per entity
3. Build the Zustand store with `localStorage` persistence middleware, initial state from fixtures, `add*`/`update*` actions per entity, and a `resetToSampleData()` action

### Phase 4 — Build Tabs (vertical slices, in this order)
1. **Dashboard**
2. **Students** — Directory + Profile drawer (Personal + Academic) + Groups & Batches
3. **Attendance**
4. **Academics**
5. **Examinations**
6. **Fees & Ledger**
7. **Library**
8. **Communication**
9. **Reports** — build last since it consumes data from every other tab; each report has a working "Download PDF" button

### Phase 5 — Polish
- Empty states for every list/table
- Form validation on all "add" flows (Students, Attendance entry, Fee entry, Book issue, etc.)
- Consistent `StatusPill` color mapping across tabs
- Verify PDF output for each report type renders correctly

### Phase 6 — Deploy
1. Deploy to Cloudflare Pages (via OpenNext) or Vercel
2. Share the live link with the client

---

## 4. Notes

- `localStorage` persistence is per-browser/device — if the client switches devices or browsers, they'll see the original sample data, not anything they added.
- Keep the layout structured so a future login/auth gate can be added without restructuring routes, even though auth isn't part of this build.
- Mock data is typed like a real API response specifically so a future backend (Cloudflare Workers + D1) can replace the data source without changing components.
