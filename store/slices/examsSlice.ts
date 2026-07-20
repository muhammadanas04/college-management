import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { Exam, MarkEntry, SemesterResult } from '../../types';
import { exams as initialExams } from '../../data/exams';
import { marks as initialMarks } from '../../data/marks';
import { results as initialResults } from '../../data/results';

export interface ExamsSlice {
  exams: Exam[];
  marks: MarkEntry[];
  results: SemesterResult[];
  
  addExam: (data: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, data: Partial<Exam>) => void;
  
  addMarkEntry: (data: Omit<MarkEntry, 'id'>) => void;
  updateMarkEntry: (id: string, data: Partial<MarkEntry>) => void;
  
  addSemesterResult: (data: Omit<SemesterResult, 'id'>) => void;
  updateSemesterResult: (id: string, data: Partial<SemesterResult>) => void;
}

export const createExamsSlice: StateCreator<AppStore, [], [], ExamsSlice> = (set) => ({
  exams: initialExams,
  marks: initialMarks,
  results: initialResults,
  
  addExam: (data) => set((state) => ({ exams: [...state.exams, { ...data, id: `ex_${Date.now()}` }] })),
  updateExam: (id, data) => set((state) => ({ exams: state.exams.map((item: Exam) => item.id === id ? { ...item, ...data } : item) })),
  
  addMarkEntry: (data) => set((state) => ({ marks: [...state.marks, { ...data, id: `mk_${Date.now()}` }] })),
  updateMarkEntry: (id, data) => set((state) => ({ marks: state.marks.map((item: MarkEntry) => item.id === id ? { ...item, ...data } : item) })),
  
  addSemesterResult: (data) => set((state) => ({ results: [...state.results, { ...data, id: `res_${Date.now()}` }] })),
  updateSemesterResult: (id, data) => set((state) => ({ results: state.results.map((item: SemesterResult) => item.id === id ? { ...item, ...data } : item) })),
});
