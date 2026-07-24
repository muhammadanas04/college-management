"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";
import { Skeleton } from "./Skeleton";
import { CardSkeleton } from "./CardSkeleton";
import { StatCardSkeleton } from "./StatCardSkeleton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
