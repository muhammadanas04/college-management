import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import CommunicationView from "@/components/tabs/CommunicationView";

export const metadata = { title: "Communication — Campus Ledger" };

export default function CommunicationPage() {
  return (
    <ErrorBoundary>
      <CommunicationView />
    </ErrorBoundary>
  );
}
