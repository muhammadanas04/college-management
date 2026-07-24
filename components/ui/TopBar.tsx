"use client";

import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
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
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="hidden sm:flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>
        <ThemeToggle />
        <ResetButton />
      </div>
    </header>
  );
}

