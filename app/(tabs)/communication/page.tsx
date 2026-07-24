import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import CommunicationView from "@/components/tabs/CommunicationView";

export default function CommunicationPage() {
  return (
    <ErrorBoundary>
      <CommunicationView />
    </ErrorBoundary>
  );
}
