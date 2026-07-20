import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { AttendanceRecord, LeaveRecord } from '../../types';
import { attendance as initialAttendance } from '../../data/attendance';
import { leaves as initialLeavesData } from '../../data/leaves';

export interface AttendanceSlice {
  attendance: AttendanceRecord[];
  leaves: LeaveRecord[];
  addAttendance: (data: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, data: Partial<AttendanceRecord>) => void;
  addLeave: (data: Omit<LeaveRecord, 'id'>) => void;
  updateLeave: (id: string, data: Partial<LeaveRecord>) => void;
}

export const createAttendanceSlice: StateCreator<AppStore, [], [], AttendanceSlice> = (set) => ({
  attendance: initialAttendance,
  leaves: initialLeavesData,
  addAttendance: (data) =>
    set((state) => ({
      attendance: [
        ...state.attendance,
        { ...data, id: `att_${Date.now()}` }
      ]
    })),
  updateAttendance: (id, data) =>
    set((state) => ({
      attendance: state.attendance.map((record: AttendanceRecord) =>
        record.id === id ? { ...record, ...data } : record
      )
    })),
  addLeave: (data) =>
    set((state) => ({
      leaves: [
        ...state.leaves,
        { ...data, id: `lv_${Date.now()}` }
      ]
    })),
  updateLeave: (id, data) =>
    set((state) => ({
      leaves: state.leaves.map((leave: LeaveRecord) =>
        leave.id === id ? { ...leave, ...data } : leave
      )
    }))
});
