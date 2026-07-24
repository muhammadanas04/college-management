import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import AcademicsView from "@/components/tabs/AcademicsView";

export default function AcademicsPage() {
  return (
    <ErrorBoundary>
      <AcademicsView />
    </ErrorBoundary>
  );
}
