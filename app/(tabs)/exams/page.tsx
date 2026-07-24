import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ExamsView from "@/components/tabs/ExamsView";

export const metadata = { title: "Examinations — Campus Ledger" };

export default function ExamsPage() {
  return (
    <ErrorBoundary>
      <ExamsView />
    </ErrorBoundary>
  );
}
