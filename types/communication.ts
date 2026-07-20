export interface Notice {
  id: string;
  title: string;
  message: string;
  audienceGroupIds: string[];  // empty = all
  date: string;
  audienceType: "student" | "parent";
}

export interface CommunicationLog {
  id: string;
  channel: "sms" | "email";
  recipientIds: string[];
  message: string;
  sentDate: string;
  status: "sent" | "failed";
}
