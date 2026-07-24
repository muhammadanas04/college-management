import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import DashboardView from "@/components/tabs/DashboardView";

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardView />
    </ErrorBoundary>
  );
}
