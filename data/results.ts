import { SemesterResult } from '../types';

export const results: SemesterResult[] = [
  {
    id: "res_001",
    studentId: "stu_001",
    semesterOrYear: "Semester 2",
    subjects: [
      { subjectId: "sub_cs_101", marksObtained: 85, maxMarks: 100, grade: "A" },
      { subjectId: "sub_cs_102", marksObtained: 88, maxMarks: 100, grade: "A+" }
    ],
    sgpa: 9.0,
    resultStatus: "pass"
  },
  {
    id: "res_002",
    studentId: "stu_002",
    semesterOrYear: "Semester 2",
    subjects: [
      { subjectId: "sub_cs_101", marksObtained: 92, maxMarks: 100, grade: "A+" },
      { subjectId: "sub_cs_102", marksObtained: 95, maxMarks: 100, grade: "O" }
    ],
    sgpa: 9.8,
    resultStatus: "pass"
  },
  {
    id: "res_003",
    studentId: "stu_005",
    semesterOrYear: "Semester 2",
    subjects: [
      { subjectId: "sub_cs_101", marksObtained: 78, maxMarks: 100, grade: "B+" },
      { subjectId: "sub_cs_102", marksObtained: 60, maxMarks: 100, grade: "C" }
    ],
    sgpa: 6.8,
    resultStatus: "pass"
  }
];
