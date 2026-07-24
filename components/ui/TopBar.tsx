"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import { ResetButton } from "./ResetButton";
import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  
  // Find the matching page meta, defaulting to a generic title if not found
  const meta = pageMeta[pathname as keyof typeof pageMeta] || {
    title: "Campus Ledger",
    breadcrumb: "Overview",
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 lg:h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <button
        className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>
      
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
          {meta.breadcrumb}
        </span>
        <h1 className="text-lg font-semibold tracking-tight">
          {meta.title}
        </h1>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <ResetButton />
      </div>
    </header>
  );
}

