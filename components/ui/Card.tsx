import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  title,
  tag,
  children,
  className,
}: {
  title: string;
  tag?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col",
        className
      )}
    >
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          {tag && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              {tag}
            </span>
          )}
        </div>
      </div>
      <div className="p-6 pt-0 flex-1 flex flex-col">{children}</div>
    </div>
  );
}
