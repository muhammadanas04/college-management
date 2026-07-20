# Campus Ledger
## Feature Plan

**Scope:** College management web app — single user (no login/roles), full feature set, generic pre-filled sample data with the ability to add data during a session.

**Platform:** Next.js (App Router), deployed as a hosted website with a shareable link.

**UI reference:** Sidebar navigation with grouped tabs, each tab composed of reusable `Card` sections. See `UI_LAYOUT.md` and `FEATURE_TREE.md` for the full tab-by-tab breakdown.

**How to use this document:** Complete phases in order. Every phase ends with a "Definition of Done" — do not move to the next phase until every item in it is true. Check off tasks as they're completed. File paths, type names, and prop signatures given below are exact — use them as written so later phases don't need to guess at earlier ones.

---

## 1. Full Feature Set

### 1.1 Dashboard
- Stat cards: enrolled students, today's attendance %, fees collected, faculty on roll
- 7-day attendance trend
- Departments/classes flagged for attention
- Recent ledger activity feed

### 1.2 Students
- Student Directory — searchable/filterable list
- Student Profile (drawer):
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

- No database. Every entity has a TypeScript interface, shaped like a real API response (see exact interfaces in Phase 3).
- **Sample data:** generic, realistic-looking fixtures per entity, stored in typed files under `/data`.
- **Session state:** a single Zustand store (slice pattern), initialized from the fixtures, with add/update actions per entity.
- **Persistence:** the store uses Zustand's `persist` middleware, `localStorage` key `campus-ledger-storage`, rehydrated on load.
- **Reset:** a `resetToSampleData()` action clears `localStorage` and reloads the original fixtures.
- **PDF generation:** `@react-pdf/renderer`, one template component per document type under `/components/pdf`.

---

## 3. Step-by-Step Implementation Plan

### Phase 0 — Project Setup ✅ COMPLETE
- [x] 1. `pnpm create next-app` — TypeScript, App Router, Tailwind
- [x] 2. Install shadcn/ui and configure base theme tokens
- [x] 3. Install Zustand
- [x] 4. Install `@react-pdf/renderer`
- [x] 5. Folder structure created
- [x] 6. ESLint/Prettier config, commit initial scaffold

---

### Phase 1 — Shell & Navigation

#### 1A. Sidebar (`/components/ui/Sidebar.tsx`)

Exact nav config to implement (drives both the sidebar and route generation):

```ts
// /components/ui/nav-config.ts
import { LayoutGrid, Users, CheckSquare, BookOpen, FileText, CreditCard, Library, MessageSquare, FileBarChart } from "lucide-react";

export const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "Students", href: "/students", icon: Users },
      { label: "Attendance", href: "/attendance", icon: CheckSquare },
      { label: "Academics", href: "/academics", icon: BookOpen },
      { label: "Examinations", href: "/exams", icon: FileText },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Fees & Ledger", href: "/fees", icon: CreditCard },
      { label: "Library", href: "/library", icon: Library },
      { label: "Communication", href: "/communication", icon: MessageSquare },
      { label: "Reports", href: "/reports", icon: FileBarChart },
    ],
  },
];
```

- [x] 1. Create `nav-config.ts` exactly as above
- [x] 2. Build `Sidebar.tsx` — renders `navGroups`, highlights active item using `usePathname()`, each item is a `<Link>`
- [x] 3. Sidebar is fixed width (~224px), full height, collapsible on narrow viewports (below 1024px) via a hamburger toggle in the top bar

#### 1B. Top Bar (`/components/ui/TopBar.tsx`)

- [x] 1. Props: `{ title: string; breadcrumb?: string }`
- [x] 2. Build a `pageMeta` lookup (route → title/breadcrumb) in `/lib/page-meta.ts`, one entry per route in `nav-config.ts`
- [x] 3. `TopBar` reads current route via `usePathname()`, looks up `pageMeta`, renders breadcrumb + title
- [x] 4. Mobile: hamburger icon that toggles the sidebar (visible below 1024px)

#### 1C. Root Layout (`/app/layout.tsx`) and Route Group

- [x] 1. Create route group `/app/(tabs)/layout.tsx` — renders `<Sidebar />` + `<TopBar />` + `{children}` in the shell structure from `UI_LAYOUT.md` §0
- [x] 2. Create empty page files for all 9 routes so navigation works before content exists:
  `/app/(tabs)/dashboard/page.tsx`, `/students/page.tsx`, `/attendance/page.tsx`, `/academics/page.tsx`, `/exams/page.tsx`, `/fees/page.tsx`, `/library/page.tsx`, `/communication/page.tsx`, `/reports/page.tsx`
- [x] 3. Root `/app/page.tsx` redirects to `/dashboard`
- [x] 4. Each page is a Server Component that renders a matching Client Component from `/components/tabs/<TabName>View.tsx` (keeps data-fetching/interactivity client-side while pages stay light)

**Definition of Done — Phase 1:** All 9 routes are reachable from the sidebar, active state highlights correctly, top bar shows the right title per route, layout doesn't break between 1024px and 1920px widths.

---

### Phase 2 — Shared Component Library

Build each component in isolation (a throwaway page or Storybook-less manual check in `/app/(tabs)/dashboard/page.tsx` is fine) before Phase 4 wires real data in.

| Component | Path | Props |
|---|---|---|
| `Card` | `/components/ui/Card.tsx` | `{ title: string; tag?: string; children: ReactNode; className?: string }` |
| `StatCard` | `/components/ui/StatCard.tsx` | `{ label: string; value: string; delta?: string; deltaDirection?: 'up' \| 'down'; accentColor?: string }` |
| `DataTable` | `/components/ui/DataTable.tsx` | `{ columns: { key: string; header: string; render?: (row: T) => ReactNode }[]; data: T[]; onRowClick?: (row: T) => void; emptyMessage?: string }` (generic `<T>`) |
| `StatusPill` | `/components/ui/StatusPill.tsx` | `{ status: 'good' \| 'warn' \| 'bad'; label: string }` |
| `FunnelChart` | `/components/ui/FunnelChart.tsx` | `{ steps: { label: string; value: number; percent: number }[] }` |
| `BarChart` | `/components/ui/BarChart.tsx` | `{ data: { label: string; value: number }[]; color?: string }` |
| `Drawer` | `/components/ui/Drawer.tsx` | `{ open: boolean; onClose: () => void; title: string; children: ReactNode }` |
| `ToggleRow` | `/components/ui/ToggleRow.tsx` | `{ label: string; checked: boolean; onChange: (v: boolean) => void }` |
| `FormField` wrappers | `/components/ui/form/*.tsx` | thin wrappers around shadcn `Input`, `Select`, `Textarea`, `DatePicker`, `FileUpload` — each takes `{ label, name, value, onChange, error? }` |

- [x] Build all components above
- [x] Each accepts a `className` passthrough for layout composition
- [x] `DataTable` supports empty state via `emptyMessage`
- [x] `Drawer` traps focus and closes on `Escape` + backdrop click

**Definition of Done — Phase 2:** every component above renders correctly with placeholder/sample props on a scratch page; no tab-specific logic lives inside these files.

---

### Phase 3 — Types & Mock Data Layer

#### 3A. Type Definitions (`/types/*.ts`, barrel-exported from `/types/index.ts`)

```ts
// /types/student.ts
export type Gender = "Male" | "Female" | "Other";
export type Category = "General" | "OBC" | "SC" | "ST" | "EWS";
export type StudentStatus = "active" | "fee-due" | "suspended";

export interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  fathersName: string;
  mothersName: string;
  dob: string;            // ISO date
  gender: Gender;
  category: Category;
  bloodGroup: string;
  aadhaarNumber: string;
  mobileNumber: string;
  email: string;
  address: string;
  photoUrl?: string;

  course: string;
  department: string;
  branch: string;
  semesterOrYear: string;
  section: string;
  rollNumber: string;
  academicSession: string;
  admissionDate: string;  // ISO date
  previousQualification: string;

  groupIds: string[];
  status: StudentStatus;
}
```

```ts
// /types/group.ts
export type GroupType =
  | "department" | "course" | "semester" | "section"
  | "subject" | "practical" | "tutorial" | "club" | "sports";

export interface Group {
  id: string;
  type: GroupType;
  name: string;
  studentIds: string[];
}
```

```ts
// /types/attendance.ts
export type AttendanceStatus = "present" | "absent" | "leave";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;           // ISO date
  subjectId?: string;     // absent = daily attendance, present = subject-wise
  status: AttendanceStatus;
  classSection: string;
}

export interface LeaveRecord {
  id: string;
  studentId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}
```

```ts
// /types/academics.ts
export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  semesterOrYear: string;
  facultyId?: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  subjectIds: string[];
}

export interface TimetableEntry {
  id: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  startTime: string;      // "09:00"
  endTime: string;        // "10:00"
  subjectId: string;
  facultyId: string;
  room: string;
  section: string;
}

export type MaterialType = "notes" | "assignment" | "homework" | "study-material";

export interface CourseMaterial {
  id: string;
  type: MaterialType;
  title: string;
  subjectId: string;
  uploadedDate: string;
  fileUrl?: string;
  dueDate?: string;       // assignments/homework
}
```

```ts
// /types/exam.ts
export type ExamType = "internal" | "practical" | "semester";

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  date: string;
  type: ExamType;
  maxMarks: number;
  room?: string;
  invigilator?: string;
  status: "scheduled" | "confirmed" | "completed";
}

export interface MarkEntry {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
}

export interface SubjectResult {
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
}

export interface SemesterResult {
  id: string;
  studentId: string;
  semesterOrYear: string;
  subjects: SubjectResult[];
  sgpa: number;
  resultStatus: "pass" | "fail" | "pending";
}
```

```ts
// /types/fees.ts
export interface FeeStructureEntry {
  id: string;
  course: string;
  semesterOrYear: string;
  feeType: string;        // "Tuition", "Hostel", "Exam Fee"
  amount: number;          // integer, smallest currency unit
}

export interface FeeCollection {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  mode: "cash" | "online" | "cheque";
  receiptNo: string;
}

export interface DueEntry {
  id: string;
  studentId: string;
  amountDue: number;
  dueDate: string;
  daysOverdue: number;
}

export interface Scholarship {
  id: string;
  studentId: string;
  name: string;
  amount: number;
  status: "applied" | "approved" | "disbursed";
}
```

```ts
// /types/library.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  copiesTotal: number;
  copiesAvailable: number;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
}

export interface Fine {
  id: string;
  bookIssueId: string;
  amount: number;
  paid: boolean;
}
```

```ts
// /types/communication.ts
export interface Notice {
  id: string;
  title: string;
  message: string;
  audienceGroupIds: string[];  // empty = all
  date: string;
  audienceType: "student" | "parent";
}

export interface CommunicationLog {
  id: string;
  channel: "sms" | "email";
  recipientIds: string[];
  message: string;
  sentDate: string;
  status: "sent" | "failed";
}
```

- [x] Create every file above exactly as specified
- [x] Create `/types/index.ts` re-exporting everything

#### 3B. Fixture Data (`/data/*.ts`)

- [x] `students.ts` — 40–60 `Student` records, spread across at least 3 departments, 3 courses, sections A/B/C, with a realistic mix of `status` values (mostly `active`, a few `fee-due`, 1–2 `suspended`)
- [x] `groups.ts` — one `Group` per department/course/semester/section actually used in `students.ts`, plus a handful of subject/practical/tutorial/club/sports groups with sensible `studentIds` subsets
- [x] `attendance.ts` — `AttendanceRecord[]` covering the last 14 days for all students (daily) plus a subset of subject-wise records
- [x] `leaves.ts` — 10–15 `LeaveRecord`s in a mix of statuses
- [x] `subjects.ts`, `faculty.ts`, `timetable.ts`, `materials.ts` — enough to populate one full weekly timetable per section and a handful of course materials per subject
- [x] `exams.ts`, `marks.ts`, `results.ts` — one upcoming exam cycle (some `scheduled`, some `confirmed`) plus one completed cycle with full `MarkEntry`/`SemesterResult` data
- [x] `fee-structure.ts`, `fee-collections.ts`, `dues.ts`, `scholarships.ts` — fee structure per course/semester, collections for most students, dues for the `fee-due`/`suspended` students, a few scholarships
- [x] `library.ts` — 20–30 `Book`s, a mix of active `BookIssue`s (some `overdue`) and returned ones, `Fine`s for overdue issues
- [x] `communication.ts` — a handful of `Notice`s and `CommunicationLog`s

All monetary fields are integers. All IDs are stable strings (e.g. `stu_001`, `bk_014`) so cross-references between fixture files are easy to read.

#### 3C. Zustand Store (`/store/useAppStore.ts`)

- [x] 1. One store, slice pattern — one slice file per domain under `/store/slices/`: `studentsSlice.ts`, `groupsSlice.ts`, `attendanceSlice.ts`, `academicsSlice.ts`, `examsSlice.ts`, `feesSlice.ts`, `librarySlice.ts`, `communicationSlice.ts`
- [x] 2. Each slice exposes: initial state = matching fixture array, `add<Entity>(data: Omit<T,'id'>): void` (generates id), `update<Entity>(id: string, data: Partial<T>): void`
- [x] 3. Combine slices in `useAppStore.ts` via Zustand's `persist` middleware:
   ```ts
   persist(
     (...a) => ({ ...createStudentsSlice(...a), ...createGroupsSlice(...a), /* etc */ }),
     { name: "campus-ledger-storage", storage: createJSONStorage(() => localStorage), version: 1 }
   )
   ```
- [x] 4. Add `resetToSampleData(): void` at the top level of the store — clears persisted state and re-seeds every slice from its fixture file
- [x] 5. Add a `<ResetButton />` component (`/components/ui/ResetButton.tsx`) that calls `resetToSampleData()` with a confirmation prompt; place it in the top bar

**Definition of Done — Phase 3:** `useAppStore` compiles with no `any`, every fixture file matches its type exactly, refreshing the browser after adding a test record (e.g. via browser devtools console calling an action) preserves the data, and the reset button restores the original fixtures.

---

### Phase 4 — Build Tabs

Build in this order. For each tab: wire the layout from `UI_LAYOUT.md`, connect real store data, implement every "add" flow listed, and confirm before moving on.

#### 4.1 Dashboard (`/components/tabs/DashboardView.tsx`)
- [x] Stat cards computed from store: student count, today's attendance % (from `attendanceSlice`), sum of `feeCollections` this term, faculty count
- [x] 7-day `BarChart` from `attendanceSlice`
- [x] Recent activity feed — merge latest `feeCollections` + `communicationLog` entries, sorted by date, capped at ~6
- [x] Departments-requiring-attention table — computed: attendance < 80% or dues > 0, grouped by department

#### 4.2 Students (`/components/tabs/StudentsView.tsx`)
- [x] `DataTable` of all students with search (name/roll/admission no.) + department/status filters
- [x] Row click opens `Drawer` → Student Profile: Personal Details card + Academic Details card, all fields from §1.2 rendered read-only, with an "Edit" toggle that turns fields into form inputs and calls `updateStudent`
- [x] "Add Student" button opens a form (same field set) → calls `addStudent`
- [x] Groups & Batches section: card grid, one card per `GroupType`, listing groups of that type with member counts; clicking a group filters the directory table to its members

#### 4.3 Attendance (`/components/tabs/AttendanceView.tsx`)
- [x] Filter toolbar: department/class/date, drives all cards below
- [x] Daily Attendance table (class, present, total, %) — row click opens drawer with per-student list for that class/date, each row has present/absent/leave toggle that calls an attendance action
- [x] Subject-wise Attendance table
- [x] Monthly Report — `BarChart` of attendance % per day for the selected month
- [x] Leave Records table with an "Add Leave" form (studentId, fromDate, toDate, reason)

#### 4.4 Academics (`/components/tabs/AcademicsView.tsx`)
- [x] Subject List table with "Add Subject" form
- [x] Faculty Allocation table (faculty → subjects), with reassign action
- [x] Timetable grid (days × time slots), populated from `timetable.ts`
- [x] Course Materials table with type filter (Notes/Assignments/Homework/Study Material) and an "Add Material" form matching `CourseMaterial`

#### 4.5 Examinations (`/components/tabs/ExamsView.tsx`)
- [x] Exam Schedule table with status pill (scheduled/confirmed/completed) and an "Add Exam" form
- [x] Marks entry: pick an exam → table of students with an editable `marksObtained` cell, saves via a `MarkEntry` action
- [x] Result Processing `FunnelChart` (graded → moderated → published) — can be a derived/simulated stat from `results.ts` counts
- [x] Semester Results / Grade Card / Result Analysis as tabs within one card, driven by `results.ts`

#### 4.6 Fees & Ledger (`/components/tabs/FeesView.tsx`)
- [x] 3 stat cards: collected this term, outstanding dues, scholarships disbursed (computed from store)
- [x] Fee Structure table + Due List table
- [x] "Collect Fee" action on a due row → records a `FeeCollection`, removes/reduces the matching `DueEntry`, and opens a receipt view (also the first PDF template, since it's the simplest)
- [x] Ledger Transaction Log — full `feeCollections` history, newest first

#### 4.7 Library (`/components/tabs/LibraryView.tsx`)
- [x] Book Issue/Return table with issue and return actions (return action also settles/creates a `Fine` if overdue)
- [x] Fine Details table with a "mark paid" action

#### 4.8 Communication (`/components/tabs/CommunicationView.tsx`)
- [x] Notices list + "Compose Notice" form (title, message, audience group, student/parent)
- [x] SMS/Email log table, read-only, populated from `communication.ts` + newly composed notices

#### 4.9 Reports (`/components/tabs/ReportsView.tsx`)
- [x] Card grid, one card per report type from §1.9
- [x] Each card has a "Download PDF" button that renders the matching `/components/pdf/<ReportName>.tsx` template via `@react-pdf/renderer`'s `pdf().toBlob()` and triggers a download
- [x] Student-specific reports (Marksheet, ID Card, Bonafide/Transfer/Character Certificate, Student Profile) need a student picker before generating

**Definition of Done — Phase 4:** every tab renders real store data (no hardcoded placeholders left), every "add" flow updates the table without a page reload, and every Reports card produces a downloaded PDF file.

---

### Phase 5 — Polish
- [x] Empty states for every list/table (uses `DataTable`'s `emptyMessage`)
- [x] Form validation on all "add" flows — required fields, sensible input types (date pickers for dates, number inputs for marks/amounts), inline error messages
- [x] Consistent `StatusPill` color mapping documented once in `/lib/status-colors.ts` and reused everywhere (don't redefine good/warn/bad per tab)
- [x] Verify PDF output for every report type — correct data, no layout overflow, filename includes student name where relevant
- [x] Loading/empty guard for `useAppStore` before hydration completes (Zustand persist is async on first load — show a lightweight skeleton instead of a flash of empty state)

---

### Phase 6 — Deploy
- [ ] 1. Choose Cloudflare Pages (via OpenNext) or Vercel
- [ ] 2. Configure build command/output per chosen platform
- [ ] 3. Set up the production deployment, verify all 9 routes and every PDF download work on the deployed link (not just localhost)
- [ ] 4. Share the live link with the client

---

## 4. Notes

- `localStorage` persistence is per-browser/device — if the client switches devices or browsers, they'll see the original sample data, not anything they added.
- Keep the layout structured so a future login/auth gate can be added without restructuring routes, even though auth isn't part of this build.
- Mock data is typed like a real API response specifically so a future backend (Cloudflare Workers + D1) can replace the data source without changing components.
- If any phase reveals that a type or fixture needs a field not listed in Phase 3, add it to the type file directly rather than working around it in a component — keep the data layer as the single source of truth.
