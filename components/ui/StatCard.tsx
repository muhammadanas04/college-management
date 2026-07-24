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

export function StatCard({
  label,
  value,
  delta,
  deltaDirection,
  accentColor,
  sparklineData,
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
      {sparklineData && sparklineData.length > 1 && (
        <div className="h-8 mt-2 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData.map((v, i) => ({ v, i }))}>
              <Line type="monotone" dataKey="v" stroke={accentColor || "var(--primary)"} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
