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
