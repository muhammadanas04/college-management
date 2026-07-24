import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import AttendanceView from "@/components/tabs/AttendanceView";

export const metadata = { title: "Attendance — Campus Ledger" };

export default function AttendancePage() {
  return (
    <ErrorBoundary>
      <AttendanceView />
    </ErrorBoundary>
  );
}
