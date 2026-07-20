import { LeaveRecord } from '../types';

export const leaves: LeaveRecord[] = [
  {
    id: "lv_001",
    studentId: "stu_002",
    fromDate: "2024-03-10",
    toDate: "2024-03-12",
    reason: "Family Function",
    status: "approved"
  },
  {
    id: "lv_002",
    studentId: "stu_004",
    fromDate: "2024-03-15",
    toDate: "2024-03-15",
    reason: "Sick Leave",
    status: "approved"
  },
  {
    id: "lv_003",
    studentId: "stu_003",
    fromDate: "2024-03-20",
    toDate: "2024-03-22",
    reason: "Attending Workshop",
    status: "pending"
  },
  {
    id: "lv_004",
    studentId: "stu_001",
    fromDate: "2024-02-14",
    toDate: "2024-02-14",
    reason: "Personal",
    status: "rejected"
  }
];
