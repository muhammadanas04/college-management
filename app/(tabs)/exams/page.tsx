import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ExamsView from "@/components/tabs/ExamsView";

export default function ExamsPage() {
  return (
    <ErrorBoundary>
      <ExamsView />
    </ErrorBoundary>
  );
}
