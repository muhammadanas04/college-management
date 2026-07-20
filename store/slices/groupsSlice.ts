import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { Group } from '../../types';
import { groups as initialGroups } from '../../data/groups';

export interface GroupsSlice {
  groups: Group[];
  addGroup: (data: Omit<Group, 'id'>) => void;
  updateGroup: (id: string, data: Partial<Group>) => void;
}

export const createGroupsSlice: StateCreator<AppStore, [], [], GroupsSlice> = (set) => ({
  groups: initialGroups,
  addGroup: (data) =>
    set((state) => ({
      groups: [
        ...state.groups,
        { ...data, id: `grp_${Date.now()}` }
      ]
    })),
  updateGroup: (id, data) =>
    set((state) => ({
      groups: state.groups.map((group: Group) =>
        group.id === id ? { ...group, ...data } : group
      )
    }))
});
