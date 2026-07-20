import { AppShell } from "@/components/ui/AppShell";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
