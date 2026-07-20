import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string; // Hex or tailwind class
  className?: string;
}

export function BarChart({ data, color, className }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn("flex h-48 w-full items-end gap-2", className)}>
      {data.map((item, index) => {
        const height = `${(item.value / max) * 100}%`;
        return (
          <div
            key={index}
            className="flex flex-1 flex-col justify-end items-center gap-2 h-full group"
          >
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {item.value}
            </span>
            <div
              className={cn(
                "w-full rounded-t-sm transition-all",
                color || "bg-primary"
              )}
              style={{ height }}
            />
            <span className="text-xs text-muted-foreground truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
