import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: "good" | "warn" | "bad";
  label: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        status === "good" &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
        status === "warn" &&
          "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
        status === "bad" &&
          "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
        className
      )}
    >
      {label}
    </span>
  );
}
