"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "./nav-config";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:static lg:flex lg:translate-x-0",
          isOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-16">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <span>Campus Ledger</span>
          </Link>
          <button
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-6 px-2">
            {navGroups.map((group) => (
              <div key={group.label} className="grid gap-2">
                <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h4>
                <div className="grid gap-1">
                  {group.items.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
