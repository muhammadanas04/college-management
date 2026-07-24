"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, CheckSquare, CreditCard, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  { label: "Home", href: "/dashboard", icon: LayoutGrid },
  { label: "Students", href: "/students", icon: Users },
  { label: "Attend.", href: "/attendance", icon: CheckSquare },
  { label: "Fees", href: "/fees", icon: CreditCard },
  { label: "Reports", href: "/reports", icon: FileBarChart },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden border-t bg-background/95 backdrop-blur-sm">
      {bottomNavItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
