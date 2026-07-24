import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import StudentsView from "@/components/tabs/StudentsView";

export const metadata = { title: "Students — Campus Ledger" };

export default function StudentsPage() {
  return (
    <ErrorBoundary>
      <StudentsView />
    </ErrorBoundary>
  );
}
