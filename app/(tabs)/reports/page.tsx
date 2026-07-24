import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ReportsView from "@/components/tabs/ReportsView";

export const metadata = { title: "Reports — Campus Ledger" };

export default function ReportsPage() {
  return (
    <ErrorBoundary>
      <ReportsView />
    </ErrorBoundary>
  );
}
