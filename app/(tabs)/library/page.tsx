import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import LibraryView from "@/components/tabs/LibraryView";

export const metadata = { title: "Library — Campus Ledger" };

export default function LibraryPage() {
  return (
    <ErrorBoundary>
      <LibraryView />
    </ErrorBoundary>
  );
}
