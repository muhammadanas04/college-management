export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  copiesTotal: number;
  copiesAvailable: number;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
}

export interface Fine {
  id: string;
  bookIssueId: string;
  amount: number;
  paid: boolean;
}
