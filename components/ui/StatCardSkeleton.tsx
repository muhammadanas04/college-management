import { Skeleton } from "./Skeleton";

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  );
}
