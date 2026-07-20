export type StatusCategory = "good" | "warn" | "bad";

export function getStatusCategory(status: string): StatusCategory {
  const normalized = status.toLowerCase();
  
  switch (normalized) {
    // Good statuses
    case "active":
    case "good":
    case "present":
    case "completed":
    case "confirmed":
    case "cleared":
    case "returned":
    case "approved":
    case "sent":
    case "pass":
    case "disbursed":
    case "paid":
      return "good";
      
    // Warn statuses
    case "warn":
    case "scheduled":
    case "pending":
    case "leave":
    case "issued":
    case "applied":
      return "warn";

    // Bad statuses
    case "bad":
    case "fee-due":
    case "suspended":
    case "absent":
    case "overdue":
    case "failed":
    case "fail":
    case "rejected":
    case "unpaid":
      return "bad";
      
    default:
      return "warn";
  }
}
