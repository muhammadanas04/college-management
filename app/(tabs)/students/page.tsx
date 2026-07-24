import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import StudentsView from "@/components/tabs/StudentsView";

export default function StudentsPage() {
  return (
    <ErrorBoundary>
      <StudentsView />
    </ErrorBoundary>
  );
}
