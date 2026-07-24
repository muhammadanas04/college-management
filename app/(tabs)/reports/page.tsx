import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ReportsView from "@/components/tabs/ReportsView";

export default function ReportsPage() {
  return (
    <ErrorBoundary>
      <ReportsView />
    </ErrorBoundary>
  );
}
