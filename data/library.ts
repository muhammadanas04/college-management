import { Book, BookIssue, Fine } from '../types';

export const books: Book[] = [
  { id: "bk_001", title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "9780262033848", copiesTotal: 10, copiesAvailable: 7 },
  { id: "bk_002", title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_003", title: "Engineering Electromagnetics", author: "William H. Hayt", isbn: "9780073380667", copiesTotal: 8, copiesAvailable: 6 },
  { id: "bk_004", title: "Marketing Management", author: "Philip Kotler", isbn: "9780133856460", copiesTotal: 12, copiesAvailable: 11 },
  { id: "bk_005", title: "Book 5", author: "Author 5", isbn: "9780000000005", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_006", title: "Book 6", author: "Author 6", isbn: "9780000000006", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_007", title: "Book 7", author: "Author 7", isbn: "9780000000007", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_008", title: "Book 8", author: "Author 8", isbn: "9780000000008", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_009", title: "Book 9", author: "Author 9", isbn: "9780000000009", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_010", title: "Book 10", author: "Author 10", isbn: "9780000000010", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_011", title: "Book 11", author: "Author 11", isbn: "9780000000011", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_012", title: "Book 12", author: "Author 12", isbn: "9780000000012", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_013", title: "Book 13", author: "Author 13", isbn: "9780000000013", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_014", title: "Book 14", author: "Author 14", isbn: "9780000000014", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_015", title: "Book 15", author: "Author 15", isbn: "9780000000015", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_016", title: "Book 16", author: "Author 16", isbn: "9780000000016", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_017", title: "Book 17", author: "Author 17", isbn: "9780000000017", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_018", title: "Book 18", author: "Author 18", isbn: "9780000000018", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_019", title: "Book 19", author: "Author 19", isbn: "9780000000019", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_020", title: "Book 20", author: "Author 20", isbn: "9780000000020", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_021", title: "Book 21", author: "Author 21", isbn: "9780000000021", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_022", title: "Book 22", author: "Author 22", isbn: "9780000000022", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_023", title: "Book 23", author: "Author 23", isbn: "9780000000023", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_024", title: "Book 24", author: "Author 24", isbn: "9780000000024", copiesTotal: 5, copiesAvailable: 5 },
  { id: "bk_025", title: "Book 25", author: "Author 25", isbn: "9780000000025", copiesTotal: 5, copiesAvailable: 5 }
];

export const bookIssues: BookIssue[] = [
  { id: "bki_001", bookId: "bk_001", studentId: "stu_001", issueDate: "2024-07-01", dueDate: "2024-07-15", returnDate: "2024-07-14", status: "returned" },
  { id: "bki_002", bookId: "bk_001", studentId: "stu_002", issueDate: "2024-07-10", dueDate: "2024-07-24", status: "issued" },
  { id: "bki_003", bookId: "bk_001", studentId: "stu_005", issueDate: "2024-06-20", dueDate: "2024-07-04", status: "overdue" },
  { id: "bki_004", bookId: "bk_003", studentId: "stu_003", issueDate: "2024-07-15", dueDate: "2024-07-29", status: "issued" },
  { id: "bki_005", bookId: "bk_004", studentId: "stu_004", issueDate: "2024-06-25", dueDate: "2024-07-09", status: "overdue" }
];

export const fines: Fine[] = [
  { id: "fin_001", bookIssueId: "bki_003", amount: 150, paid: false },
  { id: "fin_002", bookIssueId: "bki_005", amount: 100, paid: true }
];
