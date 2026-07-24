import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import AttendanceView from "@/components/tabs/AttendanceView";

export default function AttendancePage() {
  return (
    <ErrorBoundary>
      <AttendanceView />
    </ErrorBoundary>
  );
}
