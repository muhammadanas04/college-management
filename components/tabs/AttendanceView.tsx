"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { BarChart } from "@/components/ui/BarChart";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStatusCategory } from "@/lib/status-colors";
import { AttendanceStatus } from "@/types/attendance";

export default function AttendanceView() {
  const { 
    attendance, leaves, students, subjects, 
    addLeave, addAttendance, updateAttendance 
  } = useAppStore();

  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
  const [deptFilter, setDeptFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  
  const [selectedClassSection, setSelectedClassSection] = useState<string | null>(null);
  const [isLeaveDrawerOpen, setIsLeaveDrawerOpen] = useState(false);

  // Computed arrays for filters
  const departments = useMemo(() => Array.from(new Set(students.map(s => s.department))).filter(Boolean), [students]);
  const classes = useMemo(() => Array.from(new Set(students.map(s => s.course + " - " + s.semesterOrYear + " " + s.section))).filter(Boolean), [students]);

  // Daily Attendance Aggregation
  const dailyAttendanceStats = useMemo(() => {
    const records = attendance.filter(a => a.date === dateFilter && !a.subjectId);
    
    const stats: Record<string, { total: number, present: number }> = {};
    
    records.forEach(r => {
      const student = students.find(s => s.id === r.studentId);
      if (!student) return;
      if (deptFilter && student.department !== deptFilter) return;
      
      const cSec = `${student.course} - ${student.semesterOrYear} ${student.section}`;
      if (classFilter && cSec !== classFilter) return;
      
      const key = r.classSection || cSec;
      
      if (!stats[key]) stats[key] = { total: 0, present: 0 };
      stats[key].total++;
      if (r.status === "present") stats[key].present++;
    });
    
    return Object.entries(stats).map(([classSection, data]) => ({
      id: classSection,
      classSection,
      total: data.total,
      present: data.present,
      percent: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
  }, [attendance, dateFilter, deptFilter, classFilter, students]);

  // Subject-wise Attendance Aggregation
  const subjectAttendanceStats = useMemo(() => {
    const records = attendance.filter(a => a.date === dateFilter && a.subjectId);
    
    const stats: Record<string, { total: number, present: number, subjectName: string, classSection: string }> = {};
    
    records.forEach(r => {
      const student = students.find(s => s.id === r.studentId);
      if (!student) return;
      if (deptFilter && student.department !== deptFilter) return;
      
      const cSec = `${student.course} - ${student.semesterOrYear} ${student.section}`;
      if (classFilter && cSec !== classFilter) return;
      
      const key = `${r.classSection || cSec}_${r.subjectId}`;
      const subject = subjects.find(s => s.id === r.subjectId);
      
      if (!stats[key]) stats[key] = { 
        total: 0, 
        present: 0, 
        subjectName: subject?.name || r.subjectId!,
        classSection: r.classSection || cSec 
      };
      
      stats[key].total++;
      if (r.status === "present") stats[key].present++;
    });
    
    return Object.entries(stats).map(([key, data]) => ({
      ...data,
      id: key,
      percent: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
  }, [attendance, dateFilter, deptFilter, classFilter, students, subjects]);

  // Monthly Report
  const monthlyChartData = useMemo(() => {
    if (!dateFilter) return [];
    const monthPrefix = dateFilter.substring(0, 7); 
    
    const daysInMonth = new Date(parseInt(monthPrefix.split('-')[0]), parseInt(monthPrefix.split('-')[1]), 0).getDate();
    const data = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = `${monthPrefix}-${i.toString().padStart(2, '0')}`;
      const records = attendance.filter(a => a.date === dStr && !a.subjectId);
      
      let present = 0;
      let total = 0;
      
      records.forEach(r => {
        const student = students.find(s => s.id === r.studentId);
        if (!student) return;
        if (deptFilter && student.department !== deptFilter) return;
        
        const cSec = `${student.course} - ${student.semesterOrYear} ${student.section}`;
        if (classFilter && cSec !== classFilter) return;
        
        total++;
        if (r.status === "present") present++;
      });
      
      data.push({
        label: `${i}`,
        value: total > 0 ? Math.round((present / total) * 100) : 0,
      });
    }
    return data;
  }, [attendance, dateFilter, deptFilter, classFilter, students]);

  // Selected Class Section students for Drawer
  const classStudentsData = useMemo(() => {
    if (!selectedClassSection) return [];
    
    const classStudents = students.filter(s => 
      `${s.course} - ${s.semesterOrYear} ${s.section}` === selectedClassSection
    );
    
    return classStudents.map(student => {
      const record = attendance.find(a => a.date === dateFilter && a.studentId === student.id && !a.subjectId);
      return {
        student,
        record
      };
    });
  }, [selectedClassSection, students, attendance, dateFilter]);

  const handleToggleAttendance = (studentId: string, currentRecordId: string | undefined, newStatus: AttendanceStatus) => {
    if (currentRecordId) {
      updateAttendance(currentRecordId, { status: newStatus });
    } else {
      addAttendance({
        studentId,
        date: dateFilter,
        status: newStatus,
        classSection: selectedClassSection || "Unknown"
      });
    }
    toast.success("Attendance updated");
  };

  const handleAddLeave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addLeave({
      studentId: formData.get("studentId") as string,
      fromDate: formData.get("fromDate") as string,
      toDate: formData.get("toDate") as string,
      reason: formData.get("reason") as string,
      status: "pending"
    });
    setIsLeaveDrawerOpen(false);
    toast.success("Leave record added");
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const student = students.find(s => s.id === l.studentId);
      if (!student) return false;
      if (deptFilter && student.department !== deptFilter) return false;
      
      const cSec = `${student.course} - ${student.semesterOrYear} ${student.section}`;
      if (classFilter && cSec !== classFilter) return false;
      
      return true;
    }).map(l => ({
      ...l,
      studentName: students.find(s => s.id === l.studentId)?.fullName || "Unknown",
    }));
  }, [leaves, students, deptFilter, classFilter]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
      </div>

      <Card title="Filter">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input 
            type="date"
            label="Date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <Select 
            label="Department"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={[
              { label: "All Departments", value: "" },
              ...departments.map(d => ({ label: d, value: d }))
            ]}
          />
          <Select 
            label="Class/Section"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            options={[
              { label: "All Classes", value: "" },
              ...classes.map(c => ({ label: c, value: c }))
            ]}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card title="Daily Attendance" className="xl:col-span-3">
          <DataTable
            columns={[
              { key: "classSection", header: "Class" },
              { key: "total", header: "Total" },
              { key: "present", header: "Present" },
              { 
                key: "percent", 
                header: "Percentage",
                render: (row: { percent: number }) => (
                  <StatusPill 
                    status={getStatusCategory(row.percent >= 80 ? "good" : row.percent >= 60 ? "warn" : "bad")} 
                    label={`${row.percent}%`} 
                  />
                )
              }
            ]}
            data={dailyAttendanceStats}
            onRowClick={(row) => setSelectedClassSection(row.classSection)}
            emptyMessage="No attendance records for the selected date."
          />
        </Card>
        
        <Card title="Subject-wise Attendance" className="xl:col-span-2">
          <DataTable
            columns={[
              { key: "subjectName", header: "Subject" },
              { key: "classSection", header: "Class" },
              { key: "total", header: "Total" },
              { key: "present", header: "Present" },
              { 
                key: "percent", 
                header: "Percentage",
                render: (row: { percent: number }) => (
                  <StatusPill 
                    status={getStatusCategory(row.percent >= 80 ? "good" : row.percent >= 60 ? "warn" : "bad")} 
                    label={`${row.percent}%`} 
                  />
                )
              }
            ]}
            data={subjectAttendanceStats}
            emptyMessage="No subject-wise records for the selected date."
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title={`Monthly Trend (${dateFilter.substring(0, 7)})`}>
          <div className="mt-4">
            <BarChart data={monthlyChartData} color="#10b981" />
          </div>
        </Card>

        <Card title="Leave Records">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsLeaveDrawerOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2"
          >
            Add Leave
          </button>
        </div>
        <DataTable
          columns={[
            { key: "studentName", header: "Student Name" },
            { key: "fromDate", header: "From" },
            { key: "toDate", header: "To" },
            { key: "reason", header: "Reason" },
            { 
              key: "status", 
              header: "Status",
              render: (row: { status: string }) => (
                <StatusPill 
                  status={getStatusCategory(row.status)} 
                  label={row.status} 
                />
              )
            }
          ]}
          data={filteredLeaves}
          emptyMessage="No leave records found."
        />
        </Card>
      </div>

      {/* Class Section Attendance Drawer */}
      <Drawer
        open={!!selectedClassSection}
        onClose={() => setSelectedClassSection(null)}
        title={`Mark Attendance - ${selectedClassSection}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">Date: {dateFilter}</p>
          {classStudentsData.map(({ student, record }) => (
            <div key={student.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex flex-col">
                <span className="font-medium text-sm">{student.fullName}</span>
                <span className="text-xs text-muted-foreground">{student.rollNumber}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleAttendance(student.id, record?.id, "present")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${record?.status === "present" ? "bg-emerald-500 text-white" : "bg-muted hover:bg-emerald-500/20"}`}
                >
                  Present
                </button>
                <button
                  onClick={() => handleToggleAttendance(student.id, record?.id, "absent")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${record?.status === "absent" ? "bg-rose-500 text-white" : "bg-muted hover:bg-rose-500/20"}`}
                >
                  Absent
                </button>
                <button
                  onClick={() => handleToggleAttendance(student.id, record?.id, "leave")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${record?.status === "leave" ? "bg-amber-500 text-white" : "bg-muted hover:bg-amber-500/20"}`}
                >
                  Leave
                </button>
              </div>
            </div>
          ))}
          {classStudentsData.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No students in this class.</p>
          )}
        </div>
      </Drawer>

      {/* Add Leave Drawer */}
      <Drawer
        open={isLeaveDrawerOpen}
        onClose={() => setIsLeaveDrawerOpen(false)}
        title="Add Leave Record"
      >
        <form onSubmit={handleAddLeave} className="space-y-6">
          <div className="space-y-4">
            <Select 
              label="Student" 
              name="studentId" 
              options={students.map(s => ({ label: `${s.fullName} (${s.rollNumber})`, value: s.id }))} 
              required 
            />
            <Input type="date" label="From Date" name="fromDate" required />
            <Input type="date" label="To Date" name="toDate" required />
            <Input label="Reason" name="reason" required />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsLeaveDrawerOpen(false)}
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save Leave
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
