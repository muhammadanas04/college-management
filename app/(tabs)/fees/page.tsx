import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import FeesView from "@/components/tabs/FeesView";

export default function FeesPage() {
  return (
    <ErrorBoundary>
      <FeesView />
    </ErrorBoundary>
  );
}
