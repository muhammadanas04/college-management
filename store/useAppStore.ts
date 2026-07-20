import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { createStudentsSlice, StudentsSlice } from './slices/studentsSlice';
import { createGroupsSlice, GroupsSlice } from './slices/groupsSlice';
import { createAttendanceSlice, AttendanceSlice } from './slices/attendanceSlice';
import { createAcademicsSlice, AcademicsSlice } from './slices/academicsSlice';
import { createExamsSlice, ExamsSlice } from './slices/examsSlice';
import { createFeesSlice, FeesSlice } from './slices/feesSlice';
import { createLibrarySlice, LibrarySlice } from './slices/librarySlice';
import { createCommunicationSlice, CommunicationSlice } from './slices/communicationSlice';

import { students } from '../data/students';
import { groups } from '../data/groups';
import { attendance } from '../data/attendance';
import { leaves } from '../data/leaves';
import { subjects } from '../data/subjects';
import { faculty } from '../data/faculty';
import { timetable } from '../data/timetable';
import { materials } from '../data/materials';
import { exams } from '../data/exams';
import { marks } from '../data/marks';
import { results } from '../data/results';
import { feeStructure } from '../data/fee-structure';
import { feeCollections } from '../data/fee-collections';
import { dues } from '../data/dues';
import { scholarships } from '../data/scholarships';
import { books, bookIssues, fines } from '../data/library';
import { notices, communicationLogs } from '../data/communication';

export type AppStore = StudentsSlice & 
  GroupsSlice & 
  AttendanceSlice & 
  AcademicsSlice & 
  ExamsSlice & 
  FeesSlice & 
  LibrarySlice & 
  CommunicationSlice & {
    resetToSampleData: () => void;
  };

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => {
      const [set, get, api] = a;
      return {
        ...createStudentsSlice(set, get, api),
        ...createGroupsSlice(set, get, api),
        ...createAttendanceSlice(set, get, api),
        ...createAcademicsSlice(set, get, api),
        ...createExamsSlice(set, get, api),
        ...createFeesSlice(set, get, api),
        ...createLibrarySlice(set, get, api),
        ...createCommunicationSlice(set, get, api),
        
        resetToSampleData: () => {
          set({
            students,
            groups,
            attendance,
            leaves,
            subjects,
            faculty,
            timetable,
            materials,
            exams,
            marks,
            results,
            feeStructure,
            feeCollections,
            dues,
            scholarships,
            books,
            bookIssues,
            fines,
            notices,
            communicationLogs
          });
        }
      };
    },
    {
      name: "campus-ledger-storage", 
      storage: createJSONStorage(() => localStorage), 
      version: 1 
    }
  )
);
