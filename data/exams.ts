import { Exam } from '../types';

export const exams: Exam[] = [
  {
    id: "ex_001",
    name: "Mid-Term Examination",
    subjectId: "sub_cs_101",
    date: "2024-04-15",
    type: "internal",
    maxMarks: 50,
    room: "Hall A",
    invigilator: "fac_002",
    status: "confirmed"
  },
  {
    id: "ex_002",
    name: "Final Practical",
    subjectId: "sub_cs_102",
    date: "2024-05-10",
    type: "practical",
    maxMarks: 100,
    room: "CS Lab 1",
    invigilator: "fac_001",
    status: "scheduled"
  },
  {
    id: "ex_003",
    name: "Semester 2 Final",
    subjectId: "sub_cs_101",
    date: "2023-12-01",
    type: "semester",
    maxMarks: 100,
    status: "completed"
  },
  {
    id: "ex_004",
    name: "Semester 2 Final",
    subjectId: "sub_cs_102",
    date: "2023-12-03",
    type: "semester",
    maxMarks: 100,
    status: "completed"
  }
];
