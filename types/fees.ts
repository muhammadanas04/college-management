export interface FeeStructureEntry {
  id: string;
  course: string;
  semesterOrYear: string;
  feeType: string;        // "Tuition", "Hostel", "Exam Fee"
  amount: number;          // integer, smallest currency unit
}

export interface FeeCollection {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  mode: "cash" | "online" | "cheque";
  receiptNo: string;
}

export interface DueEntry {
  id: string;
  studentId: string;
  amountDue: number;
  dueDate: string;
  daysOverdue: number;
}

export interface Scholarship {
  id: string;
  studentId: string;
  name: string;
  amount: number;
  status: "applied" | "approved" | "disbursed";
}
