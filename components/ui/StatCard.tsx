import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  accentColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  deltaDirection,
  accentColor,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2",
        className
      )}
      style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: 4 } : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {delta && (
          <span
            className={cn(
              "text-xs font-medium flex items-center gap-0.5",
              deltaDirection === "up" ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {deltaDirection === "up" ? "↑" : "↓"} {delta}
          </span>
        )}
      </div>
    </div>
  );
}
