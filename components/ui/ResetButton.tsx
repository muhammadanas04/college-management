"use client";

import { useAppStore } from "@/store/useAppStore";
import { RefreshCw } from "lucide-react";

export function ResetButton() {
  const resetToSampleData = useAppStore((state) => state.resetToSampleData);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data to the initial sample data? All changes will be lost.")) {
      resetToSampleData();
      window.location.reload(); // optionally reload to ensure full re-hydration, but Zustand will re-render
    }
  };

  return (
    <button
      onClick={handleReset}
      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-input shadow-sm bg-background"
      title="Reset to Sample Data"
    >
      <RefreshCw className="h-4 w-4" />
      <span className="hidden sm:inline-block">Reset Data</span>
    </button>
  );
}
