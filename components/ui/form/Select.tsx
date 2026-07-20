import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export function Select({
  label,
  error,
  className,
  id,
  options,
  ...props
}: SelectProps) {
  const selectId = id || props.name;
  return (
    <div className={cn("grid gap-2", className)}>
      <label
        htmlFor={selectId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          error && "border-destructive focus:ring-destructive"
        )}
        {...props}
        defaultValue={props.defaultValue ?? ""}
      >
        <option value="" disabled hidden>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[0.8rem] text-destructive">{error}</span>
      )}
    </div>
  );
}
