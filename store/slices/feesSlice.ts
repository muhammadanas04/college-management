import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { FeeStructureEntry, FeeCollection, DueEntry, Scholarship } from '../../types';
import { feeStructure as initialFeeStructure } from '../../data/fee-structure';
import { feeCollections as initialFeeCollections } from '../../data/fee-collections';
import { dues as initialDues } from '../../data/dues';
import { scholarships as initialScholarships } from '../../data/scholarships';

export interface FeesSlice {
  feeStructure: FeeStructureEntry[];
  feeCollections: FeeCollection[];
  dues: DueEntry[];
  scholarships: Scholarship[];
  
  addFeeStructure: (data: Omit<FeeStructureEntry, 'id'>) => void;
  updateFeeStructure: (id: string, data: Partial<FeeStructureEntry>) => void;
  
  addFeeCollection: (data: Omit<FeeCollection, 'id'>) => void;
  updateFeeCollection: (id: string, data: Partial<FeeCollection>) => void;
  
  addDue: (data: Omit<DueEntry, 'id'>) => void;
  updateDue: (id: string, data: Partial<DueEntry>) => void;
  
  addScholarship: (data: Omit<Scholarship, 'id'>) => void;
  updateScholarship: (id: string, data: Partial<Scholarship>) => void;
}

export const createFeesSlice: StateCreator<AppStore, [], [], FeesSlice> = (set) => ({
  feeStructure: initialFeeStructure,
  feeCollections: initialFeeCollections,
  dues: initialDues,
  scholarships: initialScholarships,
  
  addFeeStructure: (data) => set((state) => ({ feeStructure: [...state.feeStructure, { ...data, id: `fs_${Date.now()}` }] })),
  updateFeeStructure: (id, data) => set((state) => ({ feeStructure: state.feeStructure.map((item: FeeStructureEntry) => item.id === id ? { ...item, ...data } : item) })),
  
  addFeeCollection: (data) => set((state) => ({ feeCollections: [...state.feeCollections, { ...data, id: `fc_${Date.now()}` }] })),
  updateFeeCollection: (id, data) => set((state) => ({ feeCollections: state.feeCollections.map((item: FeeCollection) => item.id === id ? { ...item, ...data } : item) })),
  
  addDue: (data) => set((state) => ({ dues: [...state.dues, { ...data, id: `due_${Date.now()}` }] })),
  updateDue: (id, data) => set((state) => ({ dues: state.dues.map((item: DueEntry) => item.id === id ? { ...item, ...data } : item) })),
  
  addScholarship: (data) => set((state) => ({ scholarships: [...state.scholarships, { ...data, id: `schol_${Date.now()}` }] })),
  updateScholarship: (id, data) => set((state) => ({ scholarships: state.scholarships.map((item: Scholarship) => item.id === id ? { ...item, ...data } : item) })),
});
