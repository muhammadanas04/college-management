import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function FileUpload({
  label,
  error,
  className,
  id,
  ...props
}: FileUploadProps) {
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
        type="file"
        id={inputId}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
