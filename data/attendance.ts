import { AttendanceRecord } from '../types';
import { students } from './students';
import { subjects } from './subjects';

const generateDailyAttendance = () => {
  const records: AttendanceRecord[] = [];
  
  // Simple deterministic PRNG
  const seedPRNG = (seed: number) => {
    return () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  };
  const random = seedPRNG(12345);

  // Use a fixed end date to avoid hydration mismatches
  const endDate = new Date('2026-07-20T00:00:00Z');

  // Last 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip Sundays
    if (date.getDay() === 0) continue;

    students.forEach((student) => {
      const rand = random();
      let status: "present" | "absent" | "leave" = "present";
      if (rand > 0.95) status = "leave";
      else if (rand > 0.85) status = "absent";
      
      if (student.status === "suspended") status = "absent";

      const classSection = `${student.course} - ${student.semesterOrYear} ${student.section}`;

      records.push({
        id: `att_daily_${dateStr}_${student.id}`,
        studentId: student.id,
        date: dateStr,
        status,
        classSection
      });

      // Subject-wise records for a couple of subjects
      if (random() > 0.5) {
        // Pick a random subject from the list
        const subjectIndex = Math.floor(random() * subjects.length);
        const subject = subjects[subjectIndex];
        
        records.push({
          id: `att_sub_${subject.id}_${dateStr}_${student.id}`,
          studentId: student.id,
          date: dateStr,
          status, // use same status for simplicity
          classSection,
          subjectId: subject.id
        });
      }
    });
  }
  return records;
};

export const attendance: AttendanceRecord[] = generateDailyAttendance();
