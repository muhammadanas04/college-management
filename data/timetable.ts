import { TimetableEntry } from '../types';

export const timetable: TimetableEntry[] = [
  { id: "tt_001", day: "Mon", startTime: "09:00", endTime: "10:00", subjectId: "sub_cs_101", facultyId: "fac_001", room: "Room 101", section: "A" },
  { id: "tt_002", day: "Mon", startTime: "10:00", endTime: "11:00", subjectId: "sub_cs_102", facultyId: "fac_002", room: "Room 101", section: "A" },
  { id: "tt_003", day: "Tue", startTime: "09:00", endTime: "11:00", subjectId: "sub_cs_101", facultyId: "fac_001", room: "Lab 1", section: "A" },
  { id: "tt_004", day: "Wed", startTime: "11:00", endTime: "12:00", subjectId: "sub_cs_102", facultyId: "fac_002", room: "Room 102", section: "A" },
  
  // Electrical
  { id: "tt_005", day: "Mon", startTime: "09:00", endTime: "10:00", subjectId: "sub_ee_201", facultyId: "fac_003", room: "Room 201", section: "B" },
];
