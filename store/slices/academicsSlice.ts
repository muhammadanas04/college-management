import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { Subject, Faculty, TimetableEntry, CourseMaterial } from '../../types';
import { subjects as initialSubjects } from '../../data/subjects';
import { faculty as initialFaculty } from '../../data/faculty';
import { timetable as initialTimetable } from '../../data/timetable';
import { materials as initialMaterials } from '../../data/materials';

export interface AcademicsSlice {
  subjects: Subject[];
  faculty: Faculty[];
  timetable: TimetableEntry[];
  materials: CourseMaterial[];
  
  addSubject: (data: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  
  addFaculty: (data: Omit<Faculty, 'id'>) => void;
  updateFaculty: (id: string, data: Partial<Faculty>) => void;
  
  addTimetableEntry: (data: Omit<TimetableEntry, 'id'>) => void;
  updateTimetableEntry: (id: string, data: Partial<TimetableEntry>) => void;
  
  addMaterial: (data: Omit<CourseMaterial, 'id'>) => void;
  updateMaterial: (id: string, data: Partial<CourseMaterial>) => void;
}

export const createAcademicsSlice: StateCreator<AppStore, [], [], AcademicsSlice> = (set) => ({
  subjects: initialSubjects,
  faculty: initialFaculty,
  timetable: initialTimetable,
  materials: initialMaterials,
  
  addSubject: (data) => set((state) => ({ subjects: [...state.subjects, { ...data, id: `sub_${Date.now()}` }] })),
  updateSubject: (id, data) => set((state) => ({ subjects: state.subjects.map((item: Subject) => item.id === id ? { ...item, ...data } : item) })),
  
  addFaculty: (data) => set((state) => ({ faculty: [...state.faculty, { ...data, id: `fac_${Date.now()}` }] })),
  updateFaculty: (id, data) => set((state) => ({ faculty: state.faculty.map((item: Faculty) => item.id === id ? { ...item, ...data } : item) })),
  
  addTimetableEntry: (data) => set((state) => ({ timetable: [...state.timetable, { ...data, id: `tt_${Date.now()}` }] })),
  updateTimetableEntry: (id, data) => set((state) => ({ timetable: state.timetable.map((item: TimetableEntry) => item.id === id ? { ...item, ...data } : item) })),
  
  addMaterial: (data) => set((state) => ({ materials: [...state.materials, { ...data, id: `mat_${Date.now()}` }] })),
  updateMaterial: (id, data) => set((state) => ({ materials: state.materials.map((item: CourseMaterial) => item.id === id ? { ...item, ...data } : item) })),
});
