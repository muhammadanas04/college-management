"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface FunnelStep {
  label: string;
  value: number;
  percent: number;
}

interface FunnelChartProps {
  steps: FunnelStep[];
  className?: string;
}

const COLORS = ["var(--primary)", "var(--chart-2)", "var(--chart-3)"];

export function FunnelChart({ steps, className }: FunnelChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={steps.length * 60 + 20}>
        <BarChart data={steps} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={80} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--card-foreground)" }}
            formatter={(value: any, _name: any, entry: any) => [`${value} (${entry.payload.percent}%)`, "Count"]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {steps.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
