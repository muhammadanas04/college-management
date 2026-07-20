import { cn } from "@/lib/utils";

interface FunnelStep {
  label: string;
  value: number;
  percent: number; // 0 to 100
}

interface FunnelChartProps {
  steps: FunnelStep[];
  className?: string;
}

export function FunnelChart({ steps, className }: FunnelChartProps) {
  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {steps.map((step, index) => (
        <div key={step.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{step.label}</span>
            <span className="text-muted-foreground">{step.value}</span>
          </div>
          <div className="h-5 w-full rounded-full bg-secondary flex items-center justify-center relative overflow-hidden">
            <div
              className="h-full bg-primary absolute left-1/2 -translate-x-1/2 transition-all"
              style={{ width: `${step.percent}%` }}
            />
            <span className="text-[10px] text-primary-foreground font-bold relative z-10 drop-shadow-sm">
              {step.percent}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
