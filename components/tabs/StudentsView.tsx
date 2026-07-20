"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { Student, StudentStatus } from "@/types/student";

export default function StudentsView() {
  const { students, groups, addStudent, updateStudent } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // Departments for filter
  const departments = useMemo(() => Array.from(new Set(students.map(s => s.department))).filter(Boolean), [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (deptFilter && s.department !== deptFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (groupFilter && !s.groupIds.includes(groupFilter)) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return s.fullName.toLowerCase().includes(query) || 
               s.rollNumber.toLowerCase().includes(query) ||
               s.admissionNo.toLowerCase().includes(query);
      }
      return true;
    });
  }, [students, searchQuery, deptFilter, statusFilter, groupFilter]);

  // Handle Save (Add/Edit)
  const handleSaveStudent = (e: React.FormEvent<HTMLFormElement>, isNew: boolean) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as any;
    
    // Default groupIds to [] if not provided
    data.groupIds = selectedStudent?.groupIds || [];
    
    if (isNew) {
      addStudent(data);
      setIsAddDrawerOpen(false);
    } else if (selectedStudent) {
      updateStudent(selectedStudent.id, data);
      setIsEditMode(false);
      setSelectedStudent(null);
    }
  };

  // Student Form Fields component to reuse in Add/Edit
  const StudentFormFields = ({ initialData, readOnly }: { initialData?: Partial<Student>, readOnly?: boolean }) => {
    const Field = readOnly ? 
      ({ label, value }: { label: string, value: string }) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-sm font-medium">{value || "-"}</span>
        </div>
      ) : null;

    if (readOnly && Field) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-sm border-b pb-2 mb-3">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" value={initialData?.fullName || ""} />
              <Field label="Admission No" value={initialData?.admissionNo || ""} />
              <Field label="Father's Name" value={initialData?.fathersName || ""} />
              <Field label="Mother's Name" value={initialData?.mothersName || ""} />
              <Field label="DOB" value={initialData?.dob || ""} />
              <Field label="Gender" value={initialData?.gender || ""} />
              <Field label="Category" value={initialData?.category || ""} />
              <Field label="Blood Group" value={initialData?.bloodGroup || ""} />
              <Field label="Aadhaar Number" value={initialData?.aadhaarNumber || ""} />
              <Field label="Mobile Number" value={initialData?.mobileNumber || ""} />
              <Field label="Email ID" value={initialData?.email || ""} />
              <Field label="Address" value={initialData?.address || ""} />
              <Field label="Photo URL" value={initialData?.photoUrl || ""} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm border-b pb-2 mb-3">Academic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Course" value={initialData?.course || ""} />
              <Field label="Department" value={initialData?.department || ""} />
              <Field label="Branch" value={initialData?.branch || ""} />
              <Field label="Semester/Year" value={initialData?.semesterOrYear || ""} />
              <Field label="Section" value={initialData?.section || ""} />
              <Field label="Roll Number" value={initialData?.rollNumber || ""} />
              <Field label="Academic Session" value={initialData?.academicSession || ""} />
              <Field label="Admission Date" value={initialData?.admissionDate || ""} />
              <Field label="Previous Qual." value={initialData?.previousQualification || ""} />
              <Field label="Status" value={initialData?.status || ""} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 mb-3">Personal Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" name="fullName" defaultValue={initialData?.fullName} required />
            <Input label="Admission No" name="admissionNo" defaultValue={initialData?.admissionNo} required />
            <Input label="Father's Name" name="fathersName" defaultValue={initialData?.fathersName} />
            <Input label="Mother's Name" name="mothersName" defaultValue={initialData?.mothersName} />
            <Input type="date" label="DOB" name="dob" defaultValue={initialData?.dob} />
            <Select label="Gender" name="gender" defaultValue={initialData?.gender || ""} options={[{label:"Male", value:"Male"}, {label:"Female", value:"Female"}, {label:"Other", value:"Other"}]} />
            <Select label="Category" name="category" defaultValue={initialData?.category || ""} options={[{label:"General", value:"General"}, {label:"OBC", value:"OBC"}, {label:"SC", value:"SC"}, {label:"ST", value:"ST"}, {label:"EWS", value:"EWS"}]} />
            <Input label="Blood Group" name="bloodGroup" defaultValue={initialData?.bloodGroup} />
            <Input label="Aadhaar Number" name="aadhaarNumber" defaultValue={initialData?.aadhaarNumber} />
            <Input type="tel" label="Mobile Number" name="mobileNumber" defaultValue={initialData?.mobileNumber} />
            <Input type="email" label="Email ID" name="email" defaultValue={initialData?.email} />
            <Input label="Address" name="address" defaultValue={initialData?.address} />
            <Input label="Photo URL" name="photoUrl" defaultValue={initialData?.photoUrl} />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm border-b pb-2 mb-3">Academic Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Course" name="course" defaultValue={initialData?.course} required />
            <Input label="Department" name="department" defaultValue={initialData?.department} required />
            <Input label="Branch" name="branch" defaultValue={initialData?.branch} />
            <Input label="Semester/Year" name="semesterOrYear" defaultValue={initialData?.semesterOrYear} required />
            <Input label="Section" name="section" defaultValue={initialData?.section} />
            <Input label="Roll Number" name="rollNumber" defaultValue={initialData?.rollNumber} required />
            <Input label="Academic Session" name="academicSession" defaultValue={initialData?.academicSession} />
            <Input type="date" label="Admission Date" name="admissionDate" defaultValue={initialData?.admissionDate} />
            <Input label="Previous Qual." name="previousQualification" defaultValue={initialData?.previousQualification} />
            <Select label="Status" name="status" defaultValue={initialData?.status || "active"} options={[{label:"Active", value:"active"}, {label:"Fee Due", value:"fee-due"}, {label:"Suspended", value:"suspended"}]} required />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Student Directory</h2>
        <button
          onClick={() => setIsAddDrawerOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Add Student
        </button>
      </div>

      {/* Filter Toolbar */}
      <Card title="Search & Filter">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input 
            label="Search" 
            placeholder="Name, Roll No, Adm No..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: "All Statuses", value: "" },
              { label: "Active", value: "active" },
              { label: "Fee Due", value: "fee-due" },
              { label: "Suspended", value: "suspended" },
            ]}
          />
          <Select 
            label="Group/Batch"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            options={[
              { label: "All Groups", value: "" },
              ...groups.map(g => ({ label: `${g.name} (${g.type})`, value: g.id }))
            ]}
          />
        </div>
      </Card>

      {/* Main Content Layout: Table and Groups Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card title={`Students (${filteredStudents.length})`}>
            <DataTable
              columns={[
                { key: "fullName", header: "Name" },
                { key: "rollNumber", header: "Roll No." },
                { key: "department", header: "Department" },
                { key: "course", header: "Course" },
                { key: "semesterOrYear", header: "Sem/Year" },
                { 
                  key: "status", 
                  header: "Status",
                  render: (row: { status: string }) => (
                    <StatusPill 
                      status={row.status === "active" ? "good" : row.status === "fee-due" ? "warn" : "bad"} 
                      label={row.status} 
                    />
                  )
                }
              ]}
              data={filteredStudents}
              onRowClick={(row) => {
                setSelectedStudent(row);
                setIsEditMode(false);
              }}
              emptyMessage="No students found matching your criteria."
            />
          </Card>
        </div>

        {/* Groups & Batches Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg tracking-tight">Groups & Batches</h3>
          {Object.entries(groups.reduce((acc, g) => {
            if (!acc[g.type]) acc[g.type] = [];
            acc[g.type].push(g);
            return acc;
          }, {} as Record<string, typeof groups>)).map(([type, typeGroups]) => (
            <Card key={type} title={type.charAt(0).toUpperCase() + type.slice(1)} className="text-sm">
              <div className="flex flex-col gap-2">
                {typeGroups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGroupFilter(g.id === groupFilter ? "" : g.id)}
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md hover:bg-muted text-left transition-colors ${groupFilter === g.id ? 'bg-muted font-medium' : ''}`}
                  >
                    <span className="truncate pr-2">{g.name}</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs shrink-0">
                      {g.studentIds.length}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Profile / Edit Drawer */}
      <Drawer
        open={!!selectedStudent}
        onClose={() => {
          setSelectedStudent(null);
          setIsEditMode(false);
        }}
        title={isEditMode ? "Edit Student" : "Student Profile"}
      >
        {selectedStudent && (
          <div className="space-y-6">
            {!isEditMode && (
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
            
            {isEditMode ? (
              <form onSubmit={(e) => handleSaveStudent(e, false)} className="space-y-6">
                <StudentFormFields initialData={selectedStudent} />
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <StudentFormFields initialData={selectedStudent} readOnly />
            )}
          </div>
        )}
      </Drawer>

      {/* Add Student Drawer */}
      <Drawer
        open={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add New Student"
      >
        <form onSubmit={(e) => handleSaveStudent(e, true)} className="space-y-6">
          <StudentFormFields />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsAddDrawerOpen(false)}
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Student
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
