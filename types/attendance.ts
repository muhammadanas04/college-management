export type AttendanceStatus = "present" | "absent" | "leave";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;           // ISO date
  subjectId?: string;     // absent = daily attendance, present = subject-wise
  status: AttendanceStatus;
  classSection: string;
}

export interface LeaveRecord {
  id: string;
  studentId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}
