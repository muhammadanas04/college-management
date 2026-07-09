# Campus Ledger
## CONTEXT.md

**One-liner:** Next.js website for a college management app — full feature set, single implicit user (no login), generic pre-filled sample data with the ability to add data during a session (persisted via `localStorage`). Deployed as a live link for client review.

---

## Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling/UI:** Tailwind + shadcn/ui
- **State:** Zustand — single store initialized from typed mock fixtures, persisted to `localStorage`, with add/update actions per entity
- **Data:** no database — typed fixture files in `/data`, shaped like a real API response
- **PDF export:** `@react-pdf/renderer` (or equivalent) for downloadable reports
- **Hosting:** Cloudflare Pages (OpenNext) or Vercel
- **Auth:** none — single implicit user, no login/roles

---

## Tabs

1. **Dashboard** — stat cards, attendance trend, flagged departments, recent activity
2. **Students** — directory, profile (personal + academic details), groups & batches
3. **Attendance** — daily, subject-wise, monthly report, leave records
4. **Academics** — subjects, faculty allocation, timetable, course materials
5. **Examinations** — internal/practical marks, results, grade cards, result analysis
6. **Fees & Ledger** — fee structure, collection, due list, scholarships
7. **Library** — book issue/return, fines
8. **Communication** — SMS/email notifications, student/parent notices
9. **Reports** — downloadable PDFs (marksheet, ID card, certificates, etc.)

---

## Conventions / Rules for This Project

- Vertical slices, one tab at a time, following the order in `PLAN.md` Phase 4
- Build the shared component library (`Card`, `StatCard`, `DataTable`, `StatusPill`, `FunnelChart`, `BarChart`, `Drawer/Modal`) before wiring individual tabs
- Real Next.js routes per tab — no client-only SPA tab switching
- Every mock entity gets a TypeScript interface shaped like a real API response
- Monetary values stored as integers (paise/cents equivalent), never floats
- Session additions persist via `localStorage`; a "Reset to Sample Data" action clears it and reloads the fixtures
