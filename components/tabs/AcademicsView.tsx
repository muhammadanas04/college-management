"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { Subject, Faculty, CourseMaterial } from "@/types/academics";

export default function AcademicsView() {
  const { subjects, faculty, timetable, materials, addSubject, addFaculty, updateFaculty, addMaterial } = useAppStore();
  
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [materialFilter, setMaterialFilter] = useState("");
  
  const [isEditFacultyOpen, setIsEditFacultyOpen] = useState(false);
  const [selectedFacultyForEdit, setSelectedFacultyForEdit] = useState<Faculty | null>(null);
  
  const [sectionFilter, setSectionFilter] = useState("A");

  const handleAddSubject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as any;
    addSubject(data);
    setIsAddSubjectOpen(false);
    toast.success("Subject added");
  };

  const handleAddMaterial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as any;
    addMaterial({
      ...data,
      uploadedDate: new Date().toISOString().split("T")[0],
    });
    setIsAddMaterialOpen(false);
    toast.success("Course material added");
  };

  const handleUpdateFaculty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFacultyForEdit) return;
    const formData = new FormData(e.currentTarget);
    const subjectIds = formData.getAll("subjectIds") as string[];
    updateFaculty(selectedFacultyForEdit.id, { subjectIds });
    setIsEditFacultyOpen(false);
    toast.success("Faculty subjects updated");
  };

  const filteredMaterials = useMemo(() => {
    if (!materialFilter) return materials;
    return materials.filter(m => m.type === materialFilter);
  }, [materials, materialFilter]);

  const filteredTimetable = useMemo(() => {
    if (!sectionFilter) return timetable;
    return timetable.filter(t => t.section === sectionFilter);
  }, [timetable, sectionFilter]);

  // Timetable Matrix
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeslots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Academics</h2>
        <div className="flex gap-2">
          <button onClick={() => setIsAddSubjectOpen(true)} className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Add Subject
          </button>
          <button onClick={() => setIsAddMaterialOpen(true)} className="text-sm font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            Add Material
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Subject List">
          <DataTable
            columns={[
              { key: "code", header: "Code" },
              { key: "name", header: "Name" },
              { key: "department", header: "Department" },
              { key: "semesterOrYear", header: "Sem/Year" },
            ]}
            data={subjects}
            emptyMessage="No subjects found."
          />
        </Card>

        <Card title="Faculty Allocation">
          <DataTable
            columns={[
              { key: "name", header: "Faculty Name" },
              { key: "department", header: "Department" },
              { 
                key: "subjectIds", 
                header: "Subjects",
                render: (row: Faculty) => {
                  const subjectNames = row.subjectIds
                    .map(id => subjects.find(s => s.id === id)?.name)
                    .filter(Boolean);
                  return (
                    <div className="flex flex-wrap gap-1">
                      {subjectNames.length > 0 ? subjectNames.map((name, i) => (
                        <span key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{name}</span>
                      )) : "-"}
                    </div>
                  );
                }
              },
              {
                key: "actions",
                header: "Actions",
                render: (row: Faculty) => (
                  <button 
                    onClick={() => {
                      setSelectedFacultyForEdit(row);
                      setIsEditFacultyOpen(true);
                    }}
                    className="text-primary hover:underline text-sm font-medium min-h-[44px] inline-flex items-center"
                  >
                    Reassign
                  </button>
                )
              }
            ]}
            data={faculty}
            emptyMessage="No faculty found."
          />
        </Card>
      </div>

      <Card title="Timetable">
        <div className="mb-4 w-48">
          <Select
            label="Section"
            name="section"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            options={[
              { label: "Section A", value: "A" },
              { label: "Section B", value: "B" },
              { label: "Section C", value: "C" },
            ]}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 font-medium text-muted-foreground w-20">Day</th>
                {timeslots.map(time => (
                  <th key={time} className="p-3 font-medium text-muted-foreground">{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{day}</td>
                  {timeslots.map(time => {
                    const entry = filteredTimetable.find(t => t.day === day && t.startTime === time);
                    const subject = subjects.find(s => s.id === entry?.subjectId);
                    const fac = faculty.find(f => f.id === entry?.facultyId);
                    
                    return (
                      <td key={time} className="p-3">
                        {entry ? (
                          <div className="bg-primary/5 border border-primary/10 rounded p-2 text-xs">
                            <div className="font-semibold text-primary">{subject?.code || "Unknown"}</div>
                            <div className="text-muted-foreground">{entry.room} • {entry.section}</div>
                            <div className="text-muted-foreground truncate" title={fac?.name}>{fac?.name}</div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground/30 text-xs text-center">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Course Materials">
        <div className="mb-4">
          <Select 
            label=""
            name="filter"
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value)}
            options={[
              { label: "All Materials", value: "" },
              { label: "Notes", value: "notes" },
              { label: "Assignment", value: "assignment" },
              { label: "Homework", value: "homework" },
              { label: "Study Material", value: "study-material" }
            ]}
          />
        </div>
        <DataTable
          columns={[
            { key: "title", header: "Title" },
            { 
              key: "type", 
              header: "Type",
              render: (row: CourseMaterial) => <span className="capitalize">{row.type.replace("-", " ")}</span>
            },
            { 
              key: "subjectId", 
              header: "Subject",
              render: (row: CourseMaterial) => subjects.find(s => s.id === row.subjectId)?.name || row.subjectId
            },
            { key: "uploadedDate", header: "Uploaded On" },
            { 
              key: "dueDate", 
              header: "Due Date",
              render: (row: CourseMaterial) => row.dueDate || "-"
            },
            { 
              key: "fileUrl", 
              header: "Link",
              render: (row: CourseMaterial) => row.fileUrl ? (
                <a href={row.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View</a>
              ) : "-"
            }
          ]}
          data={filteredMaterials}
          emptyMessage="No materials found."
        />
      </Card>

      <Drawer open={isAddSubjectOpen} onClose={() => setIsAddSubjectOpen(false)} title="Add Subject">
        <form onSubmit={handleAddSubject} className="space-y-4">
          <Input label="Subject Name" name="name" required />
          <Input label="Subject Code" name="code" required />
          <Input label="Department" name="department" required />
          <Input label="Semester/Year" name="semesterOrYear" required />
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors">
              Save Subject
            </button>
          </div>
        </form>
      </Drawer>

      <Drawer open={isAddMaterialOpen} onClose={() => setIsAddMaterialOpen(false)} title="Add Course Material">
        <form onSubmit={handleAddMaterial} className="space-y-4">
          <Input label="Title" name="title" required />
          <Select 
            label="Type" 
            name="type" 
            required 
            options={[
              { label: "Notes", value: "notes" },
              { label: "Assignment", value: "assignment" },
              { label: "Homework", value: "homework" },
              { label: "Study Material", value: "study-material" }
            ]}
          />
          <Select 
            label="Subject" 
            name="subjectId" 
            required
            options={subjects.map(s => ({ label: `${s.code} - ${s.name}`, value: s.id }))}
          />
          <Input type="date" label="Due Date (Optional)" name="dueDate" />
          <Input type="url" label="File URL (Optional)" name="fileUrl" />
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors">
              Save Material
            </button>
          </div>
        </form>
      </Drawer>

      <Drawer open={isEditFacultyOpen} onClose={() => setIsEditFacultyOpen(false)} title={`Reassign Subjects: ${selectedFacultyForEdit?.name}`}>
        {selectedFacultyForEdit && (
          <form onSubmit={handleUpdateFaculty} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Assigned Subjects</label>
              <div className="space-y-2 border rounded-md p-3 max-h-64 overflow-y-auto">
                {subjects.map(subject => (
                  <label key={subject.id} className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      name="subjectIds" 
                      value={subject.id}
                      defaultChecked={selectedFacultyForEdit.subjectIds.includes(subject.id)}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span>{subject.code} - {subject.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors">
                Update Faculty
              </button>
            </div>
          </form>
        )}
      </Drawer>

    </div>
  );
}
