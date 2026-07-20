export type ExamType = "internal" | "practical" | "semester";

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  date: string;
  type: ExamType;
  maxMarks: number;
  room?: string;
  invigilator?: string;
  status: "scheduled" | "confirmed" | "completed";
}

export interface MarkEntry {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
}

export interface SubjectResult {
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
}

export interface SemesterResult {
  id: string;
  studentId: string;
  semesterOrYear: string;
  subjects: SubjectResult[];
  sgpa: number;
  resultStatus: "pass" | "fail" | "pending";
}
