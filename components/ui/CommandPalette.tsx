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
