"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { BarChart } from "@/components/ui/BarChart";
import { DataTable } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStatusCategory } from "@/lib/status-colors";
import { timeAgo, formatCurrency } from "@/lib/format";

export default function DashboardView() {
  const {
    students,
    attendance,
    feeCollections,
    faculty,
    dues,
    communicationLogs,
  } = useAppStore();

  // 1. Stat Cards
  const totalStudents = students.length;
  
  const todayDate = useMemo(() => {
    const dates = attendance.map((a) => a.date).sort();
    return dates[dates.length - 1] || new Date().toISOString().split("T")[0];
  }, [attendance]);

  const todaysAttendancePercent = useMemo(() => {
    const todaysRecords = attendance.filter((a) => a.date === todayDate && !a.subjectId);
    if (todaysRecords.length === 0) return 0;
    const presentCount = todaysRecords.filter((a) => a.status === "present").length;
    return Math.round((presentCount / todaysRecords.length) * 100);
  }, [attendance, todayDate]);

  const feesCollected = useMemo(() => {
    return feeCollections.reduce((sum, fc) => sum + fc.amount, 0);
  }, [feeCollections]);

  const facultyCount = faculty.length;

  // 2. 7-day Attendance Trend
  const attendanceTrendData = useMemo(() => {
    // get unique dates, sorted descending
    const uniqueDates = Array.from(new Set(attendance.filter(a => !a.subjectId).map(a => a.date))).sort().reverse();
    const last7Dates = uniqueDates.slice(0, 7).reverse(); // Oldest to newest
    
    return last7Dates.map(date => {
      const dayRecords = attendance.filter(a => a.date === date && !a.subjectId);
      const present = dayRecords.filter(a => a.status === "present").length;
      const percent = dayRecords.length ? Math.round((present / dayRecords.length) * 100) : 0;
      const d = new Date(date);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { label, value: percent };
    });
  }, [attendance]);

  // 3. Recent Activity Feed
  const recentActivity = useMemo(() => {
    const fees = feeCollections.map(fc => ({
      id: fc.id,
      date: fc.date,
      type: "fee",
      title: "Fee Collected",
      description: `Collected ${formatCurrency(fc.amount)} for receipt ${fc.receiptNo}`,
    }));
    const comms = communicationLogs.map(log => ({
      id: log.id,
      date: log.sentDate,
      type: "comm",
      title: `Message Sent (${log.channel.toUpperCase()})`,
      description: log.message.length > 50 ? log.message.slice(0, 50) + "..." : log.message,
    }));
    
    return [...fees, ...comms]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [feeCollections, communicationLogs]);

  // 4. Departments Requiring Attention
  const deptAttention = useMemo(() => {
    const deptStats: Record<string, { totalAttendance: number, presentAttendance: number, totalDues: number }> = {};
    
    const studentDeptMap = new Map(students.map(s => [s.id, s.department]));
    
    attendance.filter(a => !a.subjectId).forEach(record => {
      const dept = studentDeptMap.get(record.studentId);
      if (!dept) return;
      if (!deptStats[dept]) deptStats[dept] = { totalAttendance: 0, presentAttendance: 0, totalDues: 0 };
      
      deptStats[dept].totalAttendance++;
      if (record.status === "present") {
        deptStats[dept].presentAttendance++;
      }
    });
    
    dues.forEach(due => {
      const dept = studentDeptMap.get(due.studentId);
      if (!dept) return;
      if (!deptStats[dept]) deptStats[dept] = { totalAttendance: 0, presentAttendance: 0, totalDues: 0 };
      
      deptStats[dept].totalDues += due.amountDue;
    });
    
    const attentionList = Object.entries(deptStats).map(([dept, stats]) => {
      const attPercent = stats.totalAttendance > 0 
        ? Math.round((stats.presentAttendance / stats.totalAttendance) * 100) 
        : 100;
      return {
        id: dept,
        department: dept,
        attendancePercent: attPercent,
        dues: stats.totalDues,
      };
    }).filter(d => d.attendancePercent < 80 || d.dues > 0);
    
    return attentionList;
  }, [students, attendance, dues]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Enrolled Students" 
          value={totalStudents.toString()} 
          accentColor="#3b82f6" 
        />
        <StatCard 
          label="Today's Attendance" 
          value={`${todaysAttendancePercent}%`} 
          delta={todaysAttendancePercent >= 80 ? "Good" : "Needs Attention"} 
          deltaDirection={todaysAttendancePercent >= 80 ? "up" : "down"}
          accentColor={todaysAttendancePercent >= 80 ? "#10b981" : "#f43f5e"}
          sparklineData={attendanceTrendData.map(d => d.value)}
        />
        <StatCard 
          label="Fees Collected (Term)" 
          value={formatCurrency(feesCollected)} 
          accentColor="#8b5cf6" 
        />
        <StatCard 
          label="Faculty on Roll" 
          value={facultyCount.toString()} 
          accentColor="#f59e0b" 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Attendance Trend (Last 7 Days)" className="lg:col-span-2">
          <div className="mt-4">
            <BarChart data={attendanceTrendData} color="#3b82f6" />
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={`${activity.type}-${activity.id}`} className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{activity.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(activity.date)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">No recent activity</div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Departments Requiring Attention">
        <DataTable
          columns={[
            { key: "department", header: "Department" },
            { 
              key: "attendancePercent", 
              header: "Attendance",
              render: (row: { attendancePercent: number }) => (
                <StatusPill 
                  status={getStatusCategory(row.attendancePercent < 80 ? "bad" : "good")} 
                  label={`${row.attendancePercent}%`} 
                />
              )
            },
            { 
              key: "dues", 
              header: "Total Dues",
              render: (row: { dues: number }) => (
                <span className={row.dues > 0 ? "text-rose-500 font-medium" : "text-emerald-500 font-medium"}>
                  {formatCurrency(row.dues)}
                </span>
              )
            }
          ]}
          data={deptAttention}
          emptyMessage="All departments are in good standing."
        />
      </Card>
    </div>
  );
}
