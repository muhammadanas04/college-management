# Campus Ledger
## UI_LAYOUT.md — Sidebar Tabs & Card Layout Spec

**Purpose:** Defines the component structure — sidebar tabs, and for each tab, what card sections it contains and how they're arranged.

---

## 0. Shell Structure

```
<AppShell>
  <Sidebar activeTab={tab} />  // fixed left nav, grouped by category
  <MainContent>
    <TopBar breadcrumb title />
    {renderActiveTab()}        // one component per tab, grid of <Card>
  </MainContent>
</AppShell>
```

- **Sidebar groups:** Overview → Academics → Operations
- **Card component:** every section is a `<Card title="..." tag="...">...</Card>` — consistent header (title + optional tag/badge) + body, reused everywhere
- **Grid system:** each tab's content area is a CSS grid of cards. Row/column spans noted per tab below.

---

## 1. Dashboard

**Layout:** 3 rows.

| Row | Layout | Cards |
|---|---|---|
| 1 | 4-column grid | Stat card × 4: Enrolled Students · Attendance Today % · Fees Collected · Faculty on Roll |
| 2 | 2-column (60/40 split) | **Left:** Attendance Trend (7-day bar chart) &nbsp;·&nbsp; **Right:** Recent Ledger Activity (scrollable list) |
| 3 | full width | Departments Requiring Attention (table: dept, attendance, fee dues, vacancies, status pill) |

---

## 2. Students

**Layout:** toolbar + 1 row + drill-down.

| Row | Layout | Cards |
|---|---|---|
| Toolbar | inline | Search box · Department filter · Status filter |
| 1 | full width | Student Directory (table: name, roll no., department, year, status pill) — paginated |
| Drill-down | side drawer | Student Profile — two cards stacked: **Personal Details** and **Academic Details** |
| 2 | full width | Groups & Batches (card grid: Department-wise, Course-wise, Semester-wise, Section-wise, Subject, Practical/Lab, Tutorial, Club, Sports) |

---

## 3. Attendance

**Layout:** toolbar + 2 rows.

| Row | Layout | Cards |
|---|---|---|
| Toolbar | inline | Filters: Department ▾ · Class ▾ · Date picker |
| 1 | 2-column (60/40) | **Left:** Daily Attendance (table: class, present, total, %) &nbsp;·&nbsp; **Right:** Subject-wise Attendance |
| 2 | 2-column (50/50) | **Left:** Monthly Report (chart) &nbsp;·&nbsp; **Right:** Leave Records (table) |

**Interaction:** clicking a class row in Daily Attendance opens a drawer with per-student attendance for that class.

---

## 4. Academics

**Layout:** 2 rows.

| Row | Layout | Cards |
|---|---|---|
| 1 | 2-column (50/50) | **Left:** Subject List &nbsp;·&nbsp; **Right:** Faculty Allocation |
| 2 | full width | Timetable (grid view) |
| 3 | full width | Course Materials (table with type filter: Notes / Assignments / Homework / Study Material) |

---

## 5. Examinations

**Layout:** 2 rows.

| Row | Layout | Cards |
|---|---|---|
| 1 | full width | Exam Schedule (table: date, course, room, invigilator) |
| 2 | 2-column (50/50) | **Left:** Internal + Practical Marks entry &nbsp;·&nbsp; **Right:** Result Processing Pipeline (funnel: graded → moderated → published) |
| 3 | full width | Semester Results / Grade Card / Result Analysis (tabbed sub-view within the card) |

---

## 6. Fees & Ledger

**Layout:** 3 rows.

| Row | Layout | Cards |
|---|---|---|
| 1 | 3-column grid | Stat card × 3: Collected This Term · Outstanding Dues · Scholarships Disbursed |
| 2 | full width | Fee Structure + Due List (table, with a "Collect Fee" action that triggers Receipt Generation) |
| 3 | full width | Ledger Transaction Log (scrollable list, same style as Dashboard's activity feed) |

---

## 7. Library

**Layout:** 1 row.

| Row | Layout | Cards |
|---|---|---|
| 1 | 2-column (60/40) | **Left:** Book Issue / Return (table with issue/return actions) &nbsp;·&nbsp; **Right:** Fine Details |

---

## 8. Communication

**Layout:** 2-column, single row.

| Row | Layout | Cards |
|---|---|---|
| 1 | 2-column (50/50) | **Left:** Student Notices / Parent Notifications (compose + list) &nbsp;·&nbsp; **Right:** SMS / Email Notification log |

---

## 9. Reports

**Layout:** 1 row, card grid.

| Row | Layout | Cards |
|---|---|---|
| 1 | 3-column grid | Report card × N (Student Profile, Attendance Report, Fee Report, Marksheet, ID Card, Library Card, Bonafide Certificate, Transfer Certificate, Character Certificate) — each card = title + short description + "Download PDF" button |

---

## Component Reuse Summary

| Component | Used in |
|---|---|
| `<StatCard>` | Dashboard, Fees & Ledger |
| `<DataTable>` | Attendance, Students, Examinations, Fees, Library, Dashboard |
| `<FunnelChart>` | Examinations (result pipeline) |
| `<BarChart>` | Dashboard (attendance trend), Attendance (monthly report) |
| `<LedgerFeed>` | Dashboard, Fees & Ledger |
| `<StatusPill>` | every table (good/warn/bad variants) |
| `<Drawer>` / `<Modal>` | Students (profile), Attendance (class drill-down) |
| `<ToggleRow>` | Communication (notification preferences) |
| PDF templates | Reports (one per document type) |

Building these as shared components first means each tab is mostly composition — faster to build and keeps the visual language consistent across the app.
