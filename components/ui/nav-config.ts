import { LayoutGrid, Users, CheckSquare, BookOpen, FileText, CreditCard, Library, MessageSquare, FileBarChart } from "lucide-react";

export const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "Students", href: "/students", icon: Users },
      { label: "Attendance", href: "/attendance", icon: CheckSquare },
      { label: "Academics", href: "/academics", icon: BookOpen },
      { label: "Examinations", href: "/exams", icon: FileText },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Fees & Ledger", href: "/fees", icon: CreditCard },
      { label: "Library", href: "/library", icon: Library },
      { label: "Communication", href: "/communication", icon: MessageSquare },
      { label: "Reports", href: "/reports", icon: FileBarChart },
    ],
  },
];
