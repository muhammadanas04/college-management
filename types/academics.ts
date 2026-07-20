export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  semesterOrYear: string;
  facultyId?: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  subjectIds: string[];
}

export interface TimetableEntry {
  id: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  startTime: string;      // "09:00"
  endTime: string;        // "10:00"
  subjectId: string;
  facultyId: string;
  room: string;
  section: string;
}

export type MaterialType = "notes" | "assignment" | "homework" | "study-material";

export interface CourseMaterial {
  id: string;
  type: MaterialType;
  title: string;
  subjectId: string;
  uploadedDate: string;
  fileUrl?: string;
  dueDate?: string;       // assignments/homework
}
