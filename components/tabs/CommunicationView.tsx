"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { Textarea } from "@/components/ui/form/Textarea";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStatusCategory } from "@/lib/status-colors";

export default function CommunicationView() {
  const { 
    notices, communicationLogs, groups, students,
    addNotice, addCommunicationLog 
  } = useAppStore();

  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Enriched Notices
  const enrichedNotices = useMemo(() => {
    return notices.map(notice => {
      const audienceGroups = notice.audienceGroupIds.length > 0 
        ? notice.audienceGroupIds.map(id => groups.find(g => g.id === id)?.name).filter(Boolean).join(", ")
        : "All";
      return {
        ...notice,
        audienceGroups
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notices, groups]);

  // Enriched Logs
  const enrichedLogs = useMemo(() => {
    return [...communicationLogs].sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());
  }, [communicationLogs]);

  const handleComposeNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const audienceGroupId = formData.get("audienceGroupId") as string;
    const audienceType = formData.get("audienceType") as "student" | "parent";
    const sendEmail = formData.get("sendEmail") === "on";
    const sendSms = formData.get("sendSms") === "on";

    const audienceGroupIds = audienceGroupId ? [audienceGroupId] : [];
    
    // 1. Add Notice
    addNotice({
      title,
      message,
      audienceGroupIds,
      audienceType,
      date: new Date().toISOString()
    });

    // 2. Add Communication Logs if checked
    if (sendEmail || sendSms) {
      // Find recipients
      let recipientIds: string[] = [];
      if (audienceGroupId) {
        const group = groups.find(g => g.id === audienceGroupId);
        if (group) recipientIds = group.studentIds;
      } else {
        recipientIds = students.map(s => s.id);
      }

      const logMessage = `[${audienceType === 'parent' ? 'To Parents' : 'To Students'}] ${title}: ${message}`;

      if (sendEmail) {
        addCommunicationLog({
          channel: "email",
          recipientIds,
          message: logMessage,
          sentDate: new Date().toISOString(),
          status: "sent"
        });
      }
      if (sendSms) {
        addCommunicationLog({
          channel: "sms",
          recipientIds,
          message: logMessage,
          sentDate: new Date().toISOString(),
          status: "sent"
        });
      }
    }

    setIsComposeOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Communication</h2>
        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Compose Notice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Notices Board">
          <div className="space-y-4">
            {enrichedNotices.length > 0 ? (
              enrichedNotices.map(notice => (
                <div key={notice.id} className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{notice.title}</h4>
                    <span className="text-xs text-muted-foreground">{new Date(notice.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notice.message}</p>
                  <div className="flex gap-2 pt-2">
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                      To: {notice.audienceType}s
                    </span>
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                      Groups: {notice.audienceGroups}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">No notices available.</div>
            )}
          </div>
        </Card>

        <Card title="SMS & Email Logs">
          <DataTable
            columns={[
              { 
                key: "channel", 
                header: "Channel",
                render: (row) => (
                  <span className={`text-xs px-2 py-1 rounded-md uppercase font-medium ${row.channel === 'sms' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {row.channel}
                  </span>
                )
              },
              { 
                key: "sentDate", 
                header: "Date",
                render: (row) => new Date(row.sentDate).toLocaleString()
              },
              { 
                key: "recipients", 
                header: "Recipients",
                render: (row) => `${row.recipientIds.length} users`
              },
              { 
                key: "status", 
                header: "Status",
                render: (row) => (
                  <StatusPill 
                    status={getStatusCategory(row.status)} 
                    label={row.status} 
                  />
                )
              },
            ]}
            data={enrichedLogs}
            emptyMessage="No communication logs."
          />
        </Card>
      </div>

      <Drawer
        open={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose Notice"
      >
        <form onSubmit={handleComposeNotice} className="space-y-6">
          <div className="space-y-4">
            <Input label="Notice Title" name="title" required />
            <Textarea label="Message" name="message" required rows={4} />
            <Select 
              label="Audience Type" 
              name="audienceType" 
              required
              options={[
                { label: "Students", value: "student" },
                { label: "Parents", value: "parent" }
              ]}
            />
            <Select 
              label="Target Group (Optional)" 
              name="audienceGroupId" 
              options={[
                { label: "All Groups", value: "" },
                ...groups.map(g => ({ label: `${g.name} (${g.type})`, value: g.id }))
              ]}
            />
            
            <div className="space-y-2 pt-2">
              <span className="text-sm font-medium">Additional Notifications</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="sendEmail" className="rounded border-input" />
                  Send via Email
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="sendSms" className="rounded border-input" />
                  Send via SMS
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsComposeOpen(false)}
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Send Notice
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
