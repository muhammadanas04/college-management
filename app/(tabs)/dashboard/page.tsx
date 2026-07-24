import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import DashboardView from "@/components/tabs/DashboardView";

export const metadata = { title: "Dashboard — Campus Ledger" };

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardView />
    </ErrorBoundary>
  );
}
