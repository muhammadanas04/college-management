export type Gender = "Male" | "Female" | "Other";
export type Category = "General" | "OBC" | "SC" | "ST" | "EWS";
export type StudentStatus = "active" | "fee-due" | "suspended";

export interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  fathersName: string;
  mothersName: string;
  dob: string;            // ISO date
  gender: Gender;
  category: Category;
  bloodGroup: string;
  aadhaarNumber: string;
  mobileNumber: string;
  email: string;
  address: string;
  photoUrl?: string;

  course: string;
  department: string;
  branch: string;
  semesterOrYear: string;
  section: string;
  rollNumber: string;
  academicSession: string;
  admissionDate: string;  // ISO date
  previousQualification: string;

  groupIds: string[];
  status: StudentStatus;
}
