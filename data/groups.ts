import { Group } from '../types';

export const groups: Group[] = [
  { id: "grp_cs", type: "department", name: "Computer Science", studentIds: ["stu_001", "stu_002"] },
  { id: "grp_ee", type: "department", name: "Electrical Engineering", studentIds: ["stu_003"] },
  { id: "grp_mgmt", type: "department", name: "Management", studentIds: ["stu_004"] },
  { id: "grp_me", type: "department", name: "Mechanical Engineering", studentIds: ["stu_005"] },
  
  { id: "grp_btech", type: "course", name: "B.Tech", studentIds: ["stu_001", "stu_002", "stu_003", "stu_005"] },
  { id: "grp_bba", type: "course", name: "BBA", studentIds: ["stu_004"] },
  
  { id: "grp_sem3", type: "semester", name: "Semester 3", studentIds: ["stu_001", "stu_002", "stu_003", "stu_004", "stu_005"] },
  
  { id: "grp_secA", type: "section", name: "Section A", studentIds: ["stu_001", "stu_002", "stu_005"] },
  { id: "grp_secB", type: "section", name: "Section B", studentIds: ["stu_003"] },
  { id: "grp_secC", type: "section", name: "Section C", studentIds: ["stu_004"] },
  
  { id: "grp_club_coding", type: "club", name: "Coding Club", studentIds: ["stu_001", "stu_002"] },
  { id: "grp_sports_cricket", type: "sports", name: "Cricket Team", studentIds: ["stu_001", "stu_003", "stu_005"] }
];
