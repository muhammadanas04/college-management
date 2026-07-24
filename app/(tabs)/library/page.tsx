import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import LibraryView from "@/components/tabs/LibraryView";

export default function LibraryPage() {
  return (
    <ErrorBoundary>
      <LibraryView />
    </ErrorBoundary>
  );
}
