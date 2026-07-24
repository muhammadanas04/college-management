# Campus Ledger — V2 Detailed Implementation Plan

> **Scope:** This is still a demo app. No backend, no auth, still `localStorage`. V2 makes
> the demo feel premium and production-ready, and prepares the codebase for a future Tauri desktop app.
>
> **Package manager:** `pnpm`. **Framework:** Next.js 16 (App Router). **Styling:** Tailwind v4 + shadcn/ui (base-nova style).

---

## Phase 0 — Install Dependencies & Create Utility Files

This phase adds all new libraries and creates shared utility files that later phases depend on.

### Step 0.1 — Install new packages

Run from the project root (`/home/anas/Development/projects/college-management`):

```bash
pnpm add sonner cmdk next-themes recharts @tanstack/react-table react-hook-form @hookform/resolvers zod
```

Packages and why:
- `sonner` — toast notifications (replaces `alert()` / `window.confirm()`)
- `cmdk` — command palette component
- `next-themes` — dark/light/system theme switching
- `recharts` — interactive charts (replaces our CSS-only `BarChart` and `FunnelChart`)
- `@tanstack/react-table` — headless table with sorting, pagination, column visibility
- `react-hook-form` — performant form handling
- `@hookform/resolvers` — bridges react-hook-form to zod
- `zod` — schema validation

### Step 0.2 — Create `/lib/platform.ts`

Create this file to abstract browser-specific APIs. Every call to `window.confirm`, `window.alert`, `document.createElement("a")` for downloads, and `localStorage` should eventually go through this module. For now, implement the browser versions.

```ts
// /lib/platform.ts

/**
 * Abstract platform APIs so Tauri can swap implementations later.
 */

export const platform = {
  /**
   * Download a blob as a file. On the web, creates a temporary <a> and clicks it.
   * In Tauri, this will use the native save dialog.
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Storage abstraction. Uses localStorage on web.
   */
  storage: {
    get(key: string): string | null {
      return localStorage.getItem(key);
    },
    set(key: string, value: string): void {
      localStorage.setItem(key, value);
    },
    remove(key: string): void {
      localStorage.removeItem(key);
    },
  },
};
```

### Step 0.3 — Create `/lib/format.ts`

Shared formatting utilities used across multiple tabs.

```ts
// /lib/format.ts

/**
 * Format an ISO date string to a relative time string.
 * e.g., "2 hours ago", "3 days ago", "just now"
 */
export function timeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Format a number as currency (INR ₹ by default).
 * Amounts are stored as integers (paise). This converts to rupees.
 */
export function formatCurrency(amountInSmallestUnit: number): string {
  return `₹${amountInSmallestUnit.toLocaleString()}`;
}
```

### Step 0.4 — Create `/hooks/useDebounce.ts`

```ts
// /hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### Step 0.5 — Create `/hooks/useEntityLookup.ts`

This replaces the repeated `students.find(s => s.id === ...)` pattern found 20+ times across tab views.

```ts
// /hooks/useEntityLookup.ts
import { useMemo } from "react";

export function useEntityLookup<T extends { id: string }>(entities: T[]): Map<string, T> {
  return useMemo(() => new Map(entities.map(e => [e.id, e])), [entities]);
}
```

### Definition of Done — Phase 0

- [x] All packages install without errors (`pnpm install` succeeds).
- [x] `/lib/platform.ts`, `/lib/format.ts`, `/hooks/useDebounce.ts`, `/hooks/useEntityLookup.ts` all exist and compile with `pnpm exec tsc --noEmit`.
- [x] No existing functionality is broken — app runs with `pnpm dev`.

---

## Phase 1 — Dark Mode & Theme Toggle

### Step 1.1 — Configure `next-themes`

Edit `/app/layout.tsx`:

1. Import `ThemeProvider` from `next-themes`.
2. Wrap the `<body>` children with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`.
3. Add `suppressHydrationWarning` to the `<html>` tag (required by next-themes to prevent hydration mismatch).

The resulting layout should look like:

```tsx
import { ThemeProvider } from "next-themes";
// ... existing imports ...

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Step 1.2 — Create Theme Toggle Button

Create `/components/ui/ThemeToggle.tsx`:

```tsx
"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      title={`Theme: ${theme}`}
      aria-label="Toggle theme"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
```

### Step 1.3 — Add Theme Toggle to TopBar

In `/components/ui/TopBar.tsx`, import `ThemeToggle` and render it inside the `ml-auto` div, next to the existing `<ResetButton />`:

```tsx
<div className="ml-auto flex items-center gap-2">
  <ThemeToggle />
  <ResetButton />
</div>
```

Note: change `gap-4` to `gap-2` for tighter spacing now that there are two buttons.

### Step 1.4 — Verify dark mode colors

The file `/app/globals.css` already has a `.dark { ... }` block (lines 86–118) with all CSS variable overrides. Verify the following components render correctly in dark mode:

- `StatCard` — the `borderLeftColor` inline style uses hex colors (`#3b82f6`, `#10b981`, etc.) which are theme-independent, so these are fine.
- `StatusPill` — already has `dark:` variants on all three status colors (lines 15–19 of StatusPill.tsx). ✅
- `BarChart` — uses tailwind classes like `bg-blue-500`, `bg-emerald-500` which work in dark mode. ✅
- `Card`, `DataTable`, `Drawer` — all use CSS variable classes (`bg-card`, `bg-background`, etc.). ✅

If any component uses hardcoded light-only colors (e.g., `bg-white`, `text-black`, `#fff`), replace with the CSS variable equivalents (`bg-background`, `text-foreground`).

### Definition of Done — Phase 1

- [ ] Clicking the theme toggle in the top bar cycles between light → dark → system.
- [ ] Preference persists across page reloads (next-themes uses localStorage by default).
- [ ] All 9 tab views render correctly in dark mode — no white-on-white or black-on-black text.
- [ ] The sidebar, top bar, drawers, and modals all follow the theme.

---

## Phase 2 — Toast Notifications (replace `alert` / `confirm`)

### Step 2.1 — Add the Sonner Toaster to the root layout

Edit `/app/layout.tsx` — inside the `<ThemeProvider>`, add the `<Toaster />` component from `sonner`:

```tsx
import { Toaster } from "sonner";

// Inside the ThemeProvider:
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
  <Toaster richColors position="bottom-right" />
</ThemeProvider>
```

### Step 2.2 — Create `/components/ui/ConfirmDialog.tsx`

Replace all `window.confirm()` calls with an in-app confirmation modal. Use this component:

```tsx
"use client";
import { ReactNode, useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({ open, onConfirm, onCancel, title, description, confirmLabel = "Confirm", variant = "default" }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-card border rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">Cancel</button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${variant === "destructive" ? "bg-destructive text-white hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 2.3 — Refactor `ResetButton.tsx` to use `ConfirmDialog` + `toast`

Replace the `window.confirm()` in `/components/ui/ResetButton.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";

export function ResetButton() {
  const resetToSampleData = useAppStore((state) => state.resetToSampleData);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-input shadow-sm bg-background"
        title="Reset to Sample Data"
      >
        <RefreshCw className="h-4 w-4" />
        <span className="hidden sm:inline-block">Reset Data</span>
      </button>
      <ConfirmDialog
        open={showConfirm}
        title="Reset All Data?"
        description="This will discard all changes and restore the original sample data. This cannot be undone."
        confirmLabel="Reset"
        variant="destructive"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          resetToSampleData();
          setShowConfirm(false);
          toast.success("Data reset to sample data");
        }}
      />
    </>
  );
}
```

### Step 2.4 — Add toast calls to all write actions

Go through each tab view and add `toast.success()` or `toast.error()` after every successful action. Import `toast` from `sonner` at the top of each file. Specific changes:

| File | Action | Toast message |
|---|---|---|
| `StudentsView.tsx` | `addStudent()` call | `toast.success("Student added successfully")` |
| `StudentsView.tsx` | `updateStudent()` call | `toast.success("Student profile updated")` |
| `AttendanceView.tsx` | `addLeave()` call | `toast.success("Leave record added")` |
| `AttendanceView.tsx` | `addAttendance()` / `updateAttendance()` | `toast.success("Attendance updated")` |
| `AcademicsView.tsx` | `addSubject()` call | `toast.success("Subject added")` |
| `AcademicsView.tsx` | `addMaterial()` call | `toast.success("Course material added")` |
| `AcademicsView.tsx` | `updateFaculty()` call | `toast.success("Faculty subjects updated")` |
| `ExamsView.tsx` | `addExam()` call | `toast.success("Exam scheduled")` |
| `ExamsView.tsx` | `addMarkEntry()` / `updateMarkEntry()` | `toast.success("Marks saved")` |
| `FeesView.tsx` | `addFeeCollection()` call | `toast.success("Fee collected — receipt downloaded")` |
| `FeesView.tsx` | PDF generation `catch` block | `toast.error("Failed to generate receipt PDF")` — replace `console.error` |
| `LibraryView.tsx` | `addBookIssue()` call | `toast.success("Book issued")` |
| `LibraryView.tsx` | `handleReturnBook()` completion | `toast.success("Book returned")` or `toast.success("Book returned — fine of ₹X created")` if overdue |
| `LibraryView.tsx` | `updateFine()` (mark paid) | `toast.success("Fine marked as paid")` |
| `CommunicationView.tsx` | `addNotice()` call | `toast.success("Notice sent")` |
| `ReportsView.tsx` | PDF generation success | `toast.success("PDF downloaded")` |
| `ReportsView.tsx` | PDF generation `catch` block | `toast.error("Failed to generate PDF")` — replace `alert()` |

Also remove the `alert("Please select a student first.")` in `ReportsView.tsx` line 33 and replace with `toast.warning("Please select a student first")`.

### Step 2.5 — Replace `alert()` in `ReportsView.tsx`

In `/components/tabs/ReportsView.tsx`:
- Line 33: replace `alert("Please select a student first.");` → `toast.warning("Select a student first"); return;`
- Line 62: replace `alert("Failed to generate PDF.");` → `toast.error("Failed to generate PDF");`

### Definition of Done — Phase 2

- [ ] Every user action shows a toast notification (success or error).
- [ ] No `window.alert()`, `window.confirm()`, or `console.error` left in any tab view or UI component.
- [ ] `ResetButton` uses the in-app `ConfirmDialog`.
- [ ] Toasts appear in the bottom-right and auto-dismiss after ~4 seconds.
- [ ] Toasts respect dark mode (sonner's `richColors` + theme detection handle this).

---

## Phase 3 — Command Palette

### Step 3.1 — Create `/components/ui/CommandPalette.tsx`

Build a command palette using the `cmdk` library. It should:

1. Open on `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux).
2. Show three groups:
   - **Pages** — all 9 nav items from `/components/ui/nav-config.ts` (import `navGroups`).
   - **Students** — list all students from the store (import `useAppStore`), clicking navigates to `/students` and opens that student's profile (you'll need to add a query param or state mechanism).
   - **Actions** — "Add Student", "Mark Attendance", "Compose Notice", "Record Fee", "Download Reports". Each navigates to the relevant page.
3. Use `useRouter()` from `next/navigation` for navigation.
4. Render as a centered modal with backdrop (similar to `ConfirmDialog` positioning).
5. Close on `Escape`, backdrop click, or after selecting an item.

Implementation:

```tsx
"use client";
import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { navGroups } from "./nav-config";
import { Search } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const students = useAppStore((s) => s.students);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <Command
        className="relative z-10 w-full max-w-lg rounded-xl border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        label="Command palette"
      >
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Command.Input
            placeholder="Search pages, students, actions..."
            className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>

          <Command.Group heading="Pages" className="text-xs text-muted-foreground px-2 py-1.5 font-semibold">
            {navGroups.flatMap((g) => g.items).map((item) => (
              <Command.Item
                key={item.href}
                value={item.label}
                onSelect={() => navigate(item.href)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Quick Actions" className="text-xs text-muted-foreground px-2 py-1.5 font-semibold">
            {[
              { label: "Add Student", href: "/students?action=add" },
              { label: "Mark Attendance", href: "/attendance" },
              { label: "Compose Notice", href: "/communication?action=compose" },
              { label: "Record Fee Payment", href: "/fees" },
              { label: "Download Reports", href: "/reports" },
            ].map((action) => (
              <Command.Item
                key={action.label}
                value={action.label}
                onSelect={() => navigate(action.href)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                {action.label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Students" className="text-xs text-muted-foreground px-2 py-1.5 font-semibold">
            {students.slice(0, 20).map((s) => (
              <Command.Item
                key={s.id}
                value={`${s.fullName} ${s.rollNumber} ${s.admissionNo}`}
                onSelect={() => navigate(`/students?student=${s.id}`)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <span>{s.fullName}</span>
                <span className="text-xs text-muted-foreground">{s.rollNumber}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex justify-between">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </Command>
    </div>
  );
}
```

### Step 3.2 — Mount the CommandPalette in AppShell

In `/components/ui/AppShell.tsx`, import and render `<CommandPalette />` inside the outer `<div>`, after the `<Sidebar>` and content area:

```tsx
import { CommandPalette } from "./CommandPalette";

// Inside the return, after the closing </div> of the flex container:
return (
  <div className="flex h-screen overflow-hidden bg-background">
    <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <main className="flex-1 overflow-y-auto bg-muted/20">{children}</main>
    </div>
    <CommandPalette />
  </div>
);
```

### Step 3.3 — Add `Cmd+K` hint to TopBar

In `/components/ui/TopBar.tsx`, add a subtle keyboard shortcut hint button that also opens the palette:

```tsx
<button
  onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
  className="hidden sm:flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
>
  <Search className="h-3.5 w-3.5" />
  <span>Search...</span>
  <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
</button>
```

Import `Search` from `lucide-react`.

### Definition of Done — Phase 3

- [ ] `Cmd+K` / `Ctrl+K` opens the command palette from any page.
- [ ] Typing filters results across pages, students, and actions.
- [ ] Selecting a page navigates to it; selecting a student navigates to `/students?student=<id>`.
- [ ] `Escape` or backdrop click closes the palette.
- [ ] The search hint button is visible in the top bar on desktop (hidden on mobile).

---

## Phase 4 — Interactive Charts (Recharts)

### Step 4.1 — Replace `/components/ui/BarChart.tsx`

Rewrite the component to use Recharts instead of CSS divs. Keep the same prop interface `{ data: { label: string; value: number }[]; color?: string; className?: string }` so existing usages don't break.

```tsx
"use client";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  className?: string;
}

export function BarChart({ data, color = "#3b82f6", className }: BarChartProps) {
  // Convert tailwind class to hex if needed (for common cases)
  const fillColor = color.startsWith("bg-") ? undefined : color;

  return (
    <div className={cn("h-48 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="label" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--card-foreground)" }}
            cursor={{ fill: "var(--accent)", opacity: 0.3 }}
          />
          <Bar dataKey="value" fill={fillColor || "var(--primary)"} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Important:** Update the two places where `BarChart` is used with a tailwind class color:
- `DashboardView.tsx` line 151: change `color="bg-blue-500"` → `color="#3b82f6"`
- `AttendanceView.tsx` line 277: change `color="bg-emerald-500"` → `color="#10b981"`

### Step 4.2 — Replace `/components/ui/FunnelChart.tsx`

Rewrite using Recharts horizontal bar chart to simulate a funnel. Keep the same prop interface.

```tsx
"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface FunnelStep {
  label: string;
  value: number;
  percent: number;
}

interface FunnelChartProps {
  steps: FunnelStep[];
  className?: string;
}

const COLORS = ["var(--primary)", "var(--chart-2)", "var(--chart-3)"];

export function FunnelChart({ steps, className }: FunnelChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={steps.length * 60 + 20}>
        <BarChart data={steps} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={80} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--card-foreground)" }}
            formatter={(value: number, _name: string, entry: any) => [`${value} (${entry.payload.percent}%)`, "Count"]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {steps.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Step 4.3 — Add sparklines to `StatCard`

Add an optional `sparklineData` prop to `/components/ui/StatCard.tsx`:

```tsx
"use client";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  accentColor?: string;
  sparklineData?: number[];
  className?: string;
}
```

Render a tiny sparkline at the bottom of the card when `sparklineData` is provided:

```tsx
{sparklineData && sparklineData.length > 1 && (
  <div className="h-8 mt-2 -mx-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={sparklineData.map((v, i) => ({ v, i }))}>
        <Line type="monotone" dataKey="v" stroke={accentColor || "var(--primary)"} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
```

Then in `DashboardView.tsx`, pass sparkline data to the attendance stat card:

```tsx
<StatCard
  label="Today's Attendance"
  value={`${todaysAttendancePercent}%`}
  delta={todaysAttendancePercent >= 80 ? "Good" : "Needs Attention"}
  deltaDirection={todaysAttendancePercent >= 80 ? "up" : "down"}
  accentColor={todaysAttendancePercent >= 80 ? "#10b981" : "#f43f5e"}
  sparklineData={attendanceTrendData.map(d => d.value)}
/>
```

### Definition of Done — Phase 4

- [ ] All bar charts show tooltips on hover, axis labels, and animated bar renders.
- [ ] The funnel chart in ExamsView renders as a horizontal stacked bar with labels and tooltips.
- [ ] The attendance StatCard on the Dashboard shows a small sparkline beneath the percentage.
- [ ] Charts resize correctly when the browser window is resized.
- [ ] Charts look correct in both light and dark mode.

---

## Phase 5 — DataTable Upgrade (TanStack Table)

### Step 5.1 — Rewrite `/components/ui/DataTable.tsx`

Replace the hand-rolled table with TanStack Table. **Keep the existing prop interface** so all 9 tab views don't need changes:

```ts
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  pageSize?: number;          // NEW — defaults to 10
  enableSorting?: boolean;    // NEW — defaults to true
}
```

The new implementation must:

1. Map our `Column<T>[]` to TanStack `ColumnDef[]` internally (in a `useMemo`).
2. Enable sorting by default — clicking a column header sorts asc → desc → none.
3. Enable client-side pagination with a page size selector (10 / 25 / 50).
4. Show a pagination bar at the bottom: "Showing 1–10 of 57" + Previous/Next buttons + page number display.
5. Render sort indicators (▲/▼) in column headers.
6. Keep the existing `onRowClick` behavior.
7. Keep the existing `emptyMessage` behavior.
8. Keep the `cursor-pointer` class when `onRowClick` is provided.

Here is the complete implementation:

```tsx
"use client";
import { ReactNode, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  pageSize?: number;
  enableSorting?: boolean;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data available.",
  className,
  pageSize = 10,
  enableSorting = true,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const tanstackColumns = useMemo<ColumnDef<T, any>[]>(
    () =>
      columns.map((col) => ({
        id: col.key,
        accessorFn: (row: T) => (row as any)[col.key],
        header: col.header,
        cell: col.render
          ? ({ row }: any) => col.render!(row.original)
          : ({ getValue }: any) => getValue(),
        enableSorting: enableSorting && !col.render, // disable sorting on custom-rendered columns unless it has a real accessor
      })),
    [columns, enableSorting]
  );

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                      header.column.getCanSort() && "cursor-pointer select-none"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-muted-foreground/50">
                          {header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center align-middle text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — only show if more than one page */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length
            )}{" "}
            of {data.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 border rounded-md text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 border rounded-md text-sm hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 5.2 — Add `"use client"` if missing

Since TanStack Table uses React hooks, ensure all files importing `DataTable` are client components. All tab views already have `"use client"` at the top. The `DataTable` itself now needs `"use client"` at the top (added in the code above).

### Step 5.3 — Test every table

After replacing `DataTable.tsx`, verify each table still works by navigating to every tab in the app:

1. **Dashboard** — Departments Requiring Attention table
2. **Students** — Student Directory table
3. **Attendance** — Daily Attendance, Subject-wise Attendance, Leave Records
4. **Academics** — Subject List, Faculty Allocation, Course Materials
5. **Exams** — Exam Schedule, Semester Results
6. **Fees** — Fee Structure, Due List, Scholarships
7. **Library** — Book Issues, Fines
8. **Communication** — SMS/Email Logs
9. **Reports** — no DataTable here

### Definition of Done — Phase 5

- [ ] All tables render with the new TanStack Table implementation.
- [ ] Clicking column headers sorts the data (asc → desc → unsorted cycle).
- [ ] Tables with >10 rows show pagination controls.
- [ ] Row click handlers still work (student profile drawer, class attendance drill-down, etc.).
- [ ] Sorting and pagination work correctly together.
- [ ] No TypeScript errors.

---

## Phase 6 — Better PDF Reports

### Step 6.1 — Create dedicated PDF templates

Create these new files under `/components/pdf/`:

#### `/components/pdf/MarksheetTemplate.tsx`
- **Layout:** A4 portrait. Header with institution name centered. Title "Marksheet" beneath.
- **Student info block:** Name, Roll No, Department, Course, Semester — in a 2-column grid.
- **Subjects table:** Full-width table with columns: Subject Code, Subject Name, Max Marks, Marks Obtained, Grade. One row per subject from `SemesterResult.subjects[]`.
- **Footer row:** SGPA, Result Status (Pass/Fail).
- **Props:** `{ student: Student; result: SemesterResult; subjects: Subject[] }`

#### `/components/pdf/IdCardTemplate.tsx`
- **Layout:** Custom page size 85.6mm × 53.98mm (credit card size). Landscape.
- **Front:** Institution name at top, student name in bold, photo placeholder (gray rectangle with "Photo" text), Roll No, Department, Course, Blood Group.
- **Back:** Address, mobile number, emergency contact, barcode placeholder (the text "BARCODE" in a code-style font).
- **Props:** `{ student: Student }`

#### `/components/pdf/CertificateTemplate.tsx`
- **Layout:** A4 portrait. Formal letterhead style.
- **Header:** Institution name large, "Affiliated to XYZ University" subtitle, address line.
- **Body:** The certificate text (passed as prop). Date on the right. "Principal" signature line at bottom right, "Registrar" at bottom left.
- **Border:** A double-line border around the page (using `@react-pdf/renderer` View with borderWidth).
- **Props:** `{ title: string; student: Student; body: string; serialNumber: string; date: string }`

#### `/components/pdf/FeeReceiptTemplate.tsx`
- Enhance the existing `ReceiptTemplate.tsx`:
- Add an itemized breakdown section (accept a `items: { description: string; amount: number }[]` prop in addition to the total).
- Add institution header with name and address.
- Add a serial number/receipt number prominently at the top.

### Step 6.2 — Update `ReportsView.tsx` to use the new templates

For each report type in the `reportTypes` array, wire up the correct template:

| Report ID | Template | Data needed from store |
|---|---|---|
| `student-profile` | `GenericReportTemplate` (existing) — add all personal + academic fields | Student |
| `attendance` | `GenericReportTemplate` with `additionalRows` | Student + compute attendance % from `attendance` records |
| `fees` | `GenericReportTemplate` with `additionalRows` | Student + sum of `feeCollections` for that student |
| `marksheet` | `MarksheetTemplate` (new) | Student + `SemesterResult` for that student + `subjects` |
| `id-card` | `IdCardTemplate` (new) | Student |
| `library-card` | `GenericReportTemplate` with library-specific rows | Student + count of active `bookIssues` |
| `bonafide` | `CertificateTemplate` (new) | Student + generated body text |
| `transfer` | `CertificateTemplate` (new) | Student + generated body text |
| `character` | `CertificateTemplate` (new) | Student + generated body text |

### Step 6.3 — Add PDF preview modal

Instead of directly downloading, show the PDF in a preview modal first. Create `/components/ui/PdfPreviewModal.tsx`:

1. Accept props `{ open, onClose, blob: Blob | null, filename: string }`.
2. When `blob` is provided, create an object URL and render it in an `<iframe>` (full modal width/height).
3. Show a "Download" button at the bottom that calls `platform.downloadFile(blob, filename)`.
4. Show a "Close" button.

Update `ReportsView.tsx` to:
1. On "Download PDF" click → generate the blob → set it in state → open the preview modal.
2. The modal shows the PDF inline.
3. The user clicks "Download" to save, or "Close" to dismiss.

### Step 6.4 — Replace `document.createElement("a")` downloads

In `FeesView.tsx` (lines 72–78), replace the manual download logic with `platform.downloadFile(blob, filename)` from `/lib/platform.ts`.

Do the same in `ReportsView.tsx` (lines 52–58).

### Definition of Done — Phase 6

- [ ] Marksheet PDF shows a proper subject table with grades and SGPA.
- [ ] ID Card PDF is credit-card sized with student details.
- [ ] Certificate PDFs have formal letterhead, border, and signature lines.
- [ ] Clicking "Download PDF" in Reports opens a preview modal first.
- [ ] The preview modal has a working "Download" button.
- [ ] All PDF downloads go through `platform.downloadFile()`.

---

## Phase 7 — Skeleton Loaders, Error Boundaries & Empty States

### Step 7.1 — Create `/components/ui/Skeleton.tsx`

```tsx
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}
```

### Step 7.2 — Create `/components/ui/CardSkeleton.tsx`

A skeleton that matches the shape of a `Card` component:

```tsx
import { Skeleton } from "./Skeleton";

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
```

### Step 7.3 — Create `/components/ui/StatCardSkeleton.tsx`

```tsx
import { Skeleton } from "./Skeleton";

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  );
}
```

### Step 7.4 — Replace the loading spinner in `AppShell.tsx`

Replace the current `<Loader2>` spinner (lines 16–22) with a full skeleton layout:

```tsx
if (!isHydrated) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:flex w-56 flex-col border-r bg-background p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-14 lg:h-16 border-b flex items-center px-6">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <CardSkeleton rows={5} />
        </div>
      </div>
    </div>
  );
}
```

Import `Skeleton`, `CardSkeleton`, `StatCardSkeleton` from their files.

### Step 7.5 — Create `/components/ui/ErrorBoundary.tsx`

```tsx
"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="mt-4 px-4 py-2 border rounded-md text-sm hover:bg-muted transition-colors">
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Step 7.6 — Wrap each tab page in an ErrorBoundary

In each of the 9 page files under `/app/(tabs)/*/page.tsx`, wrap the tab view component:

```tsx
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import DashboardView from "@/components/tabs/DashboardView";

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardView />
    </ErrorBoundary>
  );
}
```

Do this for all 9 routes: dashboard, students, attendance, academics, exams, fees, library, communication, reports.

### Step 7.7 — Create an empty state illustration component

Create `/components/ui/EmptyState.tsx`:

```tsx
import { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ icon, title, description, action }: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 bg-muted rounded-full mb-4 text-muted-foreground">
        {icon || <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

This is optional to integrate into existing tables (the `emptyMessage` prop on DataTable still works), but should be used for non-table empty states (e.g., the notices board in CommunicationView when there are no notices).

### Definition of Done — Phase 7

- [ ] First page load shows a skeleton layout (not a spinner) while Zustand hydrates.
- [ ] If a tab component throws, only that tab shows the error message — other tabs still work.
- [ ] The "Try Again" button in the error boundary re-renders the component.
- [ ] `Skeleton`, `CardSkeleton`, `StatCardSkeleton`, `ErrorBoundary`, and `EmptyState` all exist and compile.

---

## Phase 8 — Mobile Polish

### Step 8.1 — Add bottom navigation for mobile

Create `/components/ui/BottomNav.tsx`:

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, CheckSquare, CreditCard, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  { label: "Home", href: "/dashboard", icon: LayoutGrid },
  { label: "Students", href: "/students", icon: Users },
  { label: "Attend.", href: "/attendance", icon: CheckSquare },
  { label: "Fees", href: "/fees", icon: CreditCard },
  { label: "Reports", href: "/reports", icon: FileBarChart },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden border-t bg-background/95 backdrop-blur-sm">
      {bottomNavItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

### Step 8.2 — Mount BottomNav in AppShell

In `/components/ui/AppShell.tsx`, add `<BottomNav />` as the last child inside the outer div. Also add `pb-16 lg:pb-0` to the `<main>` element so content doesn't get hidden behind the bottom nav on mobile:

```tsx
<main className="flex-1 overflow-y-auto bg-muted/20 pb-16 lg:pb-0">
  {children}
</main>
<BottomNav />
```

### Step 8.3 — Ensure minimum touch targets

Audit all interactive elements across tab views. Any button, link, or toggle smaller than 44px × 44px must be enlarged. Key areas:

- **Attendance toggle buttons** (Present/Absent/Leave in the drawer): currently `px-3 py-1` with `text-xs`. Change to `px-4 py-2` and add `min-h-[44px] min-w-[44px]`.
- **Table action buttons** ("Collect Fee", "Return", "Mark Paid", "Enter Marks", "Reassign"): add `min-h-[44px]` to these inline buttons.
- **Group/batch filter buttons** in StudentsView: already `px-2 py-1.5`, change to `py-2.5`.

### Step 8.4 — Responsive table on mobile

On screens ≤ 640px, the DataTable can overflow horizontally. The current implementation already wraps the table in `overflow-auto`, which is acceptable. But for the most-used table (Student Directory), consider adding a mobile card view later as a follow-up.

For now, ensure:
- All tables have `overflow-auto` on their container (already done).
- The pagination bar wraps gracefully on small screens — use `flex-wrap` on the pagination container.

### Definition of Done — Phase 8

- [ ] Bottom tab bar is visible on mobile (≤ 1024px), hidden on desktop.
- [ ] Tapping a bottom nav item navigates to the correct page.
- [ ] The active item is highlighted.
- [ ] Content area has bottom padding so the last table row isn't hidden behind the nav bar.
- [ ] All button touch targets are ≥ 44px in height.

---

## Phase 9 — Keyboard Shortcuts & Final Polish

### Step 9.1 — Add global keyboard shortcuts

Create `/hooks/useKeyboardShortcuts.ts`:

```ts
"use client";
import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable) return;

      const key = `${e.ctrlKey || e.metaKey ? "mod+" : ""}${e.key}`;
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
```

### Step 9.2 — Wire shortcuts in `AppShell.tsx`

```tsx
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRouter } from "next/navigation";

// Inside the component:
const router = useRouter();
useKeyboardShortcuts({
  "Escape": () => {}, // Drawer close is already handled per-component
});
```

Most shortcuts (like `Cmd+K`) are already handled by the CommandPalette. The `Escape` key is already handled by the Drawer component.

### Step 9.3 — Add `<title>` per page

Each page under `/app/(tabs)/*/page.tsx` should export metadata with a specific title. Example:

```tsx
// /app/(tabs)/dashboard/page.tsx
export const metadata = { title: "Dashboard — Campus Ledger" };
```

Do this for all 9 routes:
- Dashboard — Campus Ledger
- Students — Campus Ledger
- Attendance — Campus Ledger
- Academics — Campus Ledger
- Examinations — Campus Ledger
- Fees & Ledger — Campus Ledger
- Library — Campus Ledger
- Communication — Campus Ledger
- Reports — Campus Ledger

### Step 9.4 — Use relative timestamps in activity feeds

In `DashboardView.tsx`, import `timeAgo` from `/lib/format.ts` and replace the date formatting in the recent activity feed (line 162):

```tsx
// Before:
{new Date(activity.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}

// After:
{timeAgo(activity.date)}
```

### Step 9.5 — Use `formatCurrency` consistently

In `DashboardView.tsx` and `FeesView.tsx`, replace inline `₹${...toLocaleString()}` and `$${...toLocaleString()}` calls with `formatCurrency()` from `/lib/format.ts`.

**Note:** The Fees tab currently uses `$` (dollar signs) in lines 93, 98, 104, 117, 142, 188, 219, 244, and the receipt template line 85. These should all be changed to use `formatCurrency()` which outputs `₹` (the app is for an Indian college).

### Step 9.6 — Add CSV export to DataTable

Add an optional "Export CSV" button to the DataTable. Add a new prop `enableExport?: boolean`. When true, render a small download button above the table that:

1. Iterates over `data` and `columns`.
2. For each column, uses the `key` to extract the value (skips columns where `key` is "actions").
3. Generates a CSV string with headers.
4. Calls `platform.downloadFile(new Blob([csv], { type: "text/csv" }), "export.csv")`.

### Definition of Done — Phase 9

- [ ] Each page has a descriptive `<title>` tag.
- [ ] Activity feeds show relative timestamps ("2h ago", "3d ago").
- [ ] All currency values use `₹` (not `$`).
- [ ] CSV export button appears on data tables when `enableExport` is true.
- [ ] The app builds without errors (`pnpm build` succeeds — ignore the Cloudflare-specific step for now).

---

## Summary of Files Changed/Created Per Phase

| Phase | New files | Modified files |
|---|---|---|
| 0 | `lib/platform.ts`, `lib/format.ts`, `hooks/useDebounce.ts`, `hooks/useEntityLookup.ts` | `package.json` (deps) |
| 1 | `components/ui/ThemeToggle.tsx` | `app/layout.tsx`, `components/ui/TopBar.tsx` |
| 2 | `components/ui/ConfirmDialog.tsx` | `components/ui/ResetButton.tsx`, all 9 tab views |
| 3 | `components/ui/CommandPalette.tsx` | `components/ui/AppShell.tsx`, `components/ui/TopBar.tsx` |
| 4 | — | `components/ui/BarChart.tsx`, `components/ui/FunnelChart.tsx`, `components/ui/StatCard.tsx`, `components/tabs/DashboardView.tsx`, `components/tabs/AttendanceView.tsx` |
| 5 | — | `components/ui/DataTable.tsx` |
| 6 | `components/pdf/MarksheetTemplate.tsx`, `components/pdf/IdCardTemplate.tsx`, `components/pdf/CertificateTemplate.tsx`, `components/ui/PdfPreviewModal.tsx` | `components/pdf/ReceiptTemplate.tsx`, `components/tabs/ReportsView.tsx`, `components/tabs/FeesView.tsx` |
| 7 | `components/ui/Skeleton.tsx`, `components/ui/CardSkeleton.tsx`, `components/ui/StatCardSkeleton.tsx`, `components/ui/ErrorBoundary.tsx`, `components/ui/EmptyState.tsx` | `components/ui/AppShell.tsx`, all 9 page files under `app/(tabs)/` |
| 8 | `components/ui/BottomNav.tsx` | `components/ui/AppShell.tsx`, attendance toggle buttons |
| 9 | `hooks/useKeyboardShortcuts.ts` | `components/tabs/DashboardView.tsx`, `components/tabs/FeesView.tsx`, `components/ui/DataTable.tsx`, all 9 page files under `app/(tabs)/` |

---

## Not Doing in V2

- Real backend / database (still `localStorage`)
- Authentication / roles / login screen
- Multi-user / real-time collaboration
- Email/SMS delivery (Communication tab stays a mock)
- Multi-tenant / multi-college
- React Hook Form + Zod wizard for Add Student (deferred — current form works, polish later if needed)
- Hostel, transport, payroll modules
- Native mobile app (iOS/Android)
