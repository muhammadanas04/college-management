export type GroupType =
  | "department" | "course" | "semester" | "section"
  | "subject" | "practical" | "tutorial" | "club" | "sports";

export interface Group {
  id: string;
  type: GroupType;
  name: string;
  studentIds: string[];
}
