import { CourseMaterial } from '../types';

export const materials: CourseMaterial[] = [
  {
    id: "mat_001",
    type: "notes",
    title: "Chapter 1: Intro to Data Structures",
    subjectId: "sub_cs_101",
    uploadedDate: "2024-03-01",
    fileUrl: "/assets/sample_notes.pdf"
  },
  {
    id: "mat_002",
    type: "assignment",
    title: "Assignment 1: Linked Lists",
    subjectId: "sub_cs_101",
    uploadedDate: "2024-03-10",
    dueDate: "2024-03-25",
    fileUrl: "/assets/assignment1.pdf"
  },
  {
    id: "mat_003",
    type: "study-material",
    title: "Graph Algorithms Summary",
    subjectId: "sub_cs_102",
    uploadedDate: "2024-03-12"
  },
  {
    id: "mat_004",
    type: "homework",
    title: "Homework: Marketing Mix",
    subjectId: "sub_mgmt_301",
    uploadedDate: "2024-03-15",
    dueDate: "2024-03-20"
  }
];
