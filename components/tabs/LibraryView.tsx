"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStatusCategory } from "@/lib/status-colors";

export default function LibraryView() {
  const { 
    books, bookIssues, fines, students, 
    addBookIssue, updateBookIssue, addFine, updateFine, updateBook 
  } = useAppStore();

  const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);

  // Enriched Book Issues
  const enrichedIssues = useMemo(() => {
    return bookIssues.map(issue => {
      const book = books.find(b => b.id === issue.bookId);
      const student = students.find(s => s.id === issue.studentId);
      return {
        ...issue,
        bookTitle: book?.title || "Unknown Book",
        studentName: student?.fullName || "Unknown Student",
      };
    }).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }, [bookIssues, books, students]);

  // Enriched Fines
  const enrichedFines = useMemo(() => {
    return fines.map(fine => {
      const issue = bookIssues.find(i => i.id === fine.bookIssueId);
      const student = students.find(s => s.id === issue?.studentId);
      return {
        ...fine,
        studentName: student?.fullName || "Unknown Student",
      };
    }).sort((a, b) => (a.paid === b.paid ? 0 : a.paid ? 1 : -1));
  }, [fines, bookIssues, students]);

  const handleIssueBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookId = formData.get("bookId") as string;
    const studentId = formData.get("studentId") as string;
    const issueDate = formData.get("issueDate") as string;
    const dueDate = formData.get("dueDate") as string;

    addBookIssue({
      bookId,
      studentId,
      issueDate,
      dueDate,
      status: "issued"
    });

    const book = books.find(b => b.id === bookId);
    if (book) {
      updateBook(book.id, { copiesAvailable: Math.max(0, book.copiesAvailable - 1) });
    }

    setIsIssueDrawerOpen(false);
    toast.success("Book issued");
  };

  const handleReturnBook = (issue: typeof enrichedIssues[0]) => {
    const returnDate = new Date().toISOString().split("T")[0];
    
    // Check if overdue and create fine if needed
    const due = new Date(issue.dueDate);
    const returned = new Date(returnDate);
    
    if (returned > due) {
      const diffTime = Math.abs(returned.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      const fineAmount = diffDays * 10; // ₹10 per day
      
      addFine({
        bookIssueId: issue.id,
        amount: fineAmount,
        paid: false
      });
    }

    updateBookIssue(issue.id, {
      returnDate,
      status: "returned"
    });

    const book = books.find(b => b.id === issue.bookId);
    if (book) {
      updateBook(book.id, { copiesAvailable: book.copiesAvailable + 1 });
    }
    
    if (returned > due) {
      const diffTime = Math.abs(returned.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      const fineAmount = diffDays * 10;
      toast.success(`Book returned — fine of ₹${fineAmount} created`);
    } else {
      toast.success("Book returned");
    }
  };

  const handleMarkPaid = (fineId: string) => {
    updateFine(fineId, { paid: true });
    toast.success("Fine marked as paid");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Library Management</h2>
        <button
          onClick={() => setIsIssueDrawerOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Issue Book
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Book Issues & Returns">
          <DataTable
            columns={[
              { key: "bookTitle", header: "Book" },
              { key: "studentName", header: "Student" },
              { key: "dueDate", header: "Due Date" },
              { 
                key: "status", 
                header: "Status",
                render: (row) => (
                  <StatusPill 
                    status={getStatusCategory(row.status)} 
                    label={row.status} 
                  />
                )
              },
              {
                key: "actions",
                header: "Action",
                render: (row) => row.status !== "returned" ? (
                  <button
                    onClick={() => handleReturnBook(row)}
                    className="text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md transition-colors"
                  >
                    Return
                  </button>
                ) : null
              }
            ]}
            data={enrichedIssues}
            emptyMessage="No books currently issued."
          />
        </Card>

        <Card title="Fines">
          <DataTable
            columns={[
              { key: "studentName", header: "Student" },
              { key: "amount", header: "Amount (₹)" },
              { 
                key: "paid", 
                header: "Status",
                render: (row) => (
                  <StatusPill 
                    status={getStatusCategory(row.paid ? "paid" : "unpaid")} 
                    label={row.paid ? "Paid" : "Unpaid"} 
                  />
                )
              },
              {
                key: "actions",
                header: "Action",
                render: (row) => !row.paid ? (
                  <button
                    onClick={() => handleMarkPaid(row.id)}
                    className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded-md transition-colors"
                  >
                    Mark Paid
                  </button>
                ) : null
              }
            ]}
            data={enrichedFines}
            emptyMessage="No fines recorded."
          />
        </Card>
      </div>

      <Drawer
        open={isIssueDrawerOpen}
        onClose={() => setIsIssueDrawerOpen(false)}
        title="Issue Book"
      >
        <form onSubmit={handleIssueBook} className="space-y-6">
          <div className="space-y-4">
            <Select 
              label="Book" 
              name="bookId" 
              required
              options={books.filter(b => b.copiesAvailable > 0).map(b => ({ label: `${b.title} (${b.author}) - ${b.copiesAvailable} left`, value: b.id }))}
            />
            <Select 
              label="Student" 
              name="studentId" 
              required
              options={students.map(s => ({ label: `${s.fullName} (${s.rollNumber})`, value: s.id }))}
            />
            <Input type="date" label="Issue Date" name="issueDate" required defaultValue={new Date().toISOString().split("T")[0]} />
            <Input type="date" label="Due Date" name="dueDate" required defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsIssueDrawerOpen(false)}
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Issue
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
