import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { Student } from '../../types';
import { students as initialStudents } from '../../data/students';

export interface StudentsSlice {
  students: Student[];
  addStudent: (data: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
}

export const createStudentsSlice: StateCreator<AppStore, [], [], StudentsSlice> = (set) => ({
  students: initialStudents,
  addStudent: (data) =>
    set((state) => ({
      students: [
        ...state.students,
        { ...data, id: `stu_${Date.now()}` }
      ]
    })),
  updateStudent: (id, data) =>
    set((state) => ({
      students: state.students.map((student: Student) =>
        student.id === id ? { ...student, ...data } : student
      )
    }))
});
