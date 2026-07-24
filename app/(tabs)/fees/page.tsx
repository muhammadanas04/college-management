import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import FeesView from "@/components/tabs/FeesView";

export const metadata = { title: "Fees & Ledger — Campus Ledger" };

export default function FeesPage() {
  return (
    <ErrorBoundary>
      <FeesView />
    </ErrorBoundary>
  );
}
