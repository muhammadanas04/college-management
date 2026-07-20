import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { Notice, CommunicationLog } from '../../types';
import { notices as initialNotices, communicationLogs as initialCommunicationLogs } from '../../data/communication';

export interface CommunicationSlice {
  notices: Notice[];
  communicationLogs: CommunicationLog[];
  
  addNotice: (data: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, data: Partial<Notice>) => void;
  
  addCommunicationLog: (data: Omit<CommunicationLog, 'id'>) => void;
  updateCommunicationLog: (id: string, data: Partial<CommunicationLog>) => void;
}

export const createCommunicationSlice: StateCreator<AppStore, [], [], CommunicationSlice> = (set) => ({
  notices: initialNotices,
  communicationLogs: initialCommunicationLogs,
  
  addNotice: (data) => set((state) => ({ notices: [...state.notices, { ...data, id: `not_${Date.now()}` }] })),
  updateNotice: (id, data) => set((state) => ({ notices: state.notices.map((item: Notice) => item.id === id ? { ...item, ...data } : item) })),
  
  addCommunicationLog: (data) => set((state) => ({ communicationLogs: [...state.communicationLogs, { ...data, id: `log_${Date.now()}` }] })),
  updateCommunicationLog: (id, data) => set((state) => ({ communicationLogs: state.communicationLogs.map((item: CommunicationLog) => item.id === id ? { ...item, ...data } : item) })),
});
