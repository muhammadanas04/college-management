import { Notice, CommunicationLog } from '../types';

export const notices: Notice[] = [
  {
    id: "not_001",
    title: "Mid-Term Examination Schedule",
    message: "The mid-term examinations will commence from 15th April. Please check the timetable on the portal.",
    audienceGroupIds: ["grp_btech", "grp_bba"],
    date: "2024-04-01",
    audienceType: "student"
  },
  {
    id: "not_002",
    title: "Fee Payment Reminder",
    message: "Last date to clear semester dues without late fee is 1st August.",
    audienceGroupIds: [], // all
    date: "2024-07-15",
    audienceType: "parent"
  }
];

export const communicationLogs: CommunicationLog[] = [
  {
    id: "log_001",
    channel: "email",
    recipientIds: ["stu_003", "stu_005"], // parents of fee-due/suspended
    message: "Reminder: Fee Payment Overdue",
    sentDate: "2024-07-16",
    status: "sent"
  },
  {
    id: "log_002",
    channel: "sms",
    recipientIds: ["stu_001", "stu_002", "stu_003", "stu_004", "stu_005"],
    message: "College will remain closed tomorrow due to local elections.",
    sentDate: "2024-07-10",
    status: "sent"
  }
];
