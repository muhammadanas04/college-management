"use client";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  className?: string;
}

export function BarChart({ data, color = "#3b82f6", className }: BarChartProps) {
  // Convert tailwind class to hex if needed (for common cases)
  const fillColor = color.startsWith("bg-") ? undefined : color;

  return (
    <div className={cn("h-48 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="label" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--card-foreground)" }}
            cursor={{ fill: "var(--accent)", opacity: 0.3 }}
          />
          <Bar dataKey="value" fill={fillColor || "var(--primary)"} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
