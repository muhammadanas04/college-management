# Campus Ledger — Feature Tree
## FEATURE_TREE.md

Maps every feature to a **tab** (sidebar), **section** (card within that tab), or **field/action** (inside a section).

---

```
📁 Dashboard  (tab)
   • Overview stat cards, attendance trend, recent activity

📁 Students  (tab)
   ├─ Student Directory (section)
   │    └─ searchable/filterable list of all students
   │
   ├─ Student Profile (drawer/modal — opens from directory)
   │    ├─ Personal Details (card)
   │    │    ├─ Student ID
   │    │    ├─ Admission No.
   │    │    ├─ Full Name
   │    │    ├─ Father's Name
   │    │    ├─ Mother's Name
   │    │    ├─ Date of Birth
   │    │    ├─ Gender
   │    │    ├─ Category
   │    │    ├─ Blood Group
   │    │    ├─ Aadhaar Number
   │    │    ├─ Mobile Number
   │    │    ├─ Email ID
   │    │    ├─ Address
   │    │    └─ Photo Upload
   │    │
   │    └─ Academic Details (card)
   │         ├─ Course
   │         ├─ Department
   │         ├─ Branch
   │         ├─ Semester/Year
   │         ├─ Section
   │         ├─ Roll Number
   │         ├─ Academic Session
   │         ├─ Admission Date
   │         └─ Previous Qualification
   │
   └─ Groups & Batches (section)
        → filter/grouping definitions used across Students, Attendance,
          Academics, and Communication tabs
        ├─ Department-wise Groups
        ├─ Course-wise Groups
        ├─ Semester-wise Groups
        ├─ Section-wise Groups
        ├─ Subject Groups
        ├─ Practical/Lab Groups
        ├─ Tutorial Groups
        ├─ Club Groups
        └─ Sports Groups

📁 Attendance  (tab)
   ├─ Daily Attendance (card, includes attendance % inline)
   ├─ Subject-wise Attendance (card)
   ├─ Monthly Report (card)
   └─ Leave Records (card)

📁 Academics  (tab)
   ├─ Subject List (card)
   ├─ Faculty Allocation (card)
   ├─ Timetable (card)
   └─ Course Materials (card, with a type filter)
        ├─ Notes Upload
        ├─ Assignments
        ├─ Homework
        └─ Online Study Material

📁 Examinations  (tab)
   ├─ Internal Marks (card)
   ├─ Practical Marks (card)
   ├─ Semester Results (card)
   ├─ Grade Card (card)
   └─ Result Analysis (card)

📁 Fees & Ledger  (tab)
   ├─ Fee Structure (card)
   ├─ Fee Collection (card, with Receipt Generation as an inline action)
   ├─ Due List (card)
   └─ Scholarship Details (card)

📁 Library  (tab)
   ├─ Book Issue (card)
   ├─ Book Return (card)
   └─ Fine Details (card)

📁 Communication  (tab)
   ├─ SMS Notifications (card)
   ├─ Email Notifications (card)
   ├─ Student Notices (card)
   └─ Parent Notifications (card)

📁 Reports  (tab)
   → every item below renders on screen and exports as a downloadable PDF
   ├─ Student Profile
   ├─ Attendance Report
   ├─ Fee Report
   ├─ Marksheet
   ├─ ID Card
   ├─ Library Card
   ├─ Bonafide Certificate
   ├─ Transfer Certificate
   └─ Character Certificate
```

---

## Component Reuse

| Component | Used in |
|---|---|
| `StatCard` | Dashboard, Fees & Ledger |
| `DataTable` | Attendance, Students, Examinations, Fees, Library, Dashboard |
| `FunnelChart` | Examinations (result pipeline) |
| `BarChart` | Dashboard (attendance trend) |
| `LedgerFeed` | Dashboard, Fees & Ledger |
| `StatusPill` | every table (good/warn/bad variants) |
| `Drawer`/`Modal` | Students (profile) |
| `ToggleRow` | Communication (notification preferences) |
| PDF templates | Reports (one per document type) |
