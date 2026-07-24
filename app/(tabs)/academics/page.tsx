import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import AcademicsView from "@/components/tabs/AcademicsView";

export const metadata = { title: "Academics — Campus Ledger" };

export default function AcademicsPage() {
  return (
    <ErrorBoundary>
      <AcademicsView />
    </ErrorBoundary>
  );
}
