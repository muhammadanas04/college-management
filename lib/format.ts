/**
 * Format an ISO date string to a relative time string.
 * e.g., "2 hours ago", "3 days ago", "just now"
 */
export function timeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Format a number as currency (INR ₹ by default).
 * Amounts are stored as integers (paise). This converts to rupees.
 */
export function formatCurrency(amountInSmallestUnit: number): string {
  return `₹${amountInSmallestUnit.toLocaleString()}`;
}
