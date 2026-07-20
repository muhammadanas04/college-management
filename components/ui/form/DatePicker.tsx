import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function DatePicker({
  label,
  error,
  className,
  id,
  ...props
}: DatePickerProps) {
  const inputId = id || props.name;
  return (
    <div className={cn("grid gap-2", className)}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <input
        type="date"
        id={inputId}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        {...props}
      />
      {error && (
        <span className="text-[0.8rem] text-destructive">{error}</span>
      )}
    </div>
  );
}
