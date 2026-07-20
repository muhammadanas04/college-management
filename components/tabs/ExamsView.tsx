"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { FunnelChart } from "@/components/ui/FunnelChart";
import { getStatusCategory } from "@/lib/status-colors";
import { Exam, MarkEntry, SemesterResult, SubjectResult } from "@/types/exam";

export default function ExamsView() {
  const { exams, marks, results, subjects, students, addExam, addMarkEntry, updateMarkEntry } = useAppStore();
  
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [selectedExamForMarks, setSelectedExamForMarks] = useState<Exam | null>(null);
  
  const [resultTab, setResultTab] = useState<"results" | "grade-card" | "analysis">("results");

  const handleAddExam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as any;
    addExam({
      ...data,
      maxMarks: Number(data.maxMarks),
    });
    setIsAddExamOpen(false);
  };



  // Funnel chart data for Results
  const funnelSteps = useMemo(() => {
    const total = students.length;
    const graded = results.length;
    const published = results.filter(r => r.resultStatus === "pass" || r.resultStatus === "fail").length;
    
    return [
      { label: "Total Students", value: total, percent: 100 },
      { label: "Graded", value: graded, percent: total ? Math.round((graded/total)*100) : 0 },
      { label: "Published", value: published, percent: total ? Math.round((published/total)*100) : 0 },
    ];
  }, [students.length, results]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Examinations</h2>
        <button onClick={() => setIsAddExamOpen(true)} className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Add Exam
        </button>
      </div>

      <Card title="Exam Schedule">
        <DataTable
          columns={[
            { key: "name", header: "Name" },
            { 
              key: "subjectId", 
              header: "Subject",
              render: (row: Exam) => subjects.find(s => s.id === row.subjectId)?.name || row.subjectId
            },
            { key: "date", header: "Date" },
            { key: "type", header: "Type", render: (row: Exam) => <span className="capitalize">{row.type}</span> },
            { key: "room", header: "Room" },
            { 
              key: "status", 
              header: "Status",
              render: (row: Exam) => (
                  <StatusPill 
                    status={getStatusCategory(row.status)}
                    label={row.status}
                  />
              )
            },
            {
              key: "actions",
              header: "Actions",
              render: (row: Exam) => (
                <button 
                  onClick={() => setSelectedExamForMarks(row)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Enter Marks
                </button>
              )
            }
          ]}
          data={exams}
          emptyMessage="No exams scheduled."
        />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Marks Entry (Select Exam Above)">
          {selectedExamForMarks ? (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <span className="font-semibold">{selectedExamForMarks.name}</span> - Max Marks: {selectedExamForMarks.maxMarks}
              </div>
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Student List</h4>
                <div className="max-h-96 overflow-y-auto pr-2">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 font-medium">Student Name</th>
                        <th className="p-2 font-medium">Roll No</th>
                        <th className="p-2 font-medium w-32">Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => {
                        const mark = marks.find(m => m.examId === selectedExamForMarks.id && m.studentId === student.id);
                        return (
                          <tr key={student.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-2">{student.fullName}</td>
                            <td className="p-2">{student.rollNumber}</td>
                            <td className="p-2">
                              <input 
                                type="number" 
                                min="0" 
                                max={selectedExamForMarks.maxMarks}
                                defaultValue={mark?.marksObtained}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  if (val === "") return;
                                  const num = Number(val);
                                  if (mark) {
                                    if (mark.marksObtained !== num) {
                                      updateMarkEntry(mark.id, { marksObtained: num });
                                    }
                                  } else {
                                    addMarkEntry({
                                      examId: selectedExamForMarks.id,
                                      studentId: student.id,
                                      marksObtained: num
                                    });
                                  }
                                }}
                                className="w-full rounded border border-input px-2 py-1 text-sm bg-background"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-muted/20">
              Select an exam from the schedule to enter marks.
            </div>
          )}
        </Card>

        <Card title="Result Processing Pipeline">
          <FunnelChart steps={funnelSteps} />
        </Card>
      </div>

      <Card title="Result Analysis">
        <div className="border-b mb-4 flex gap-6">
          {(["results", "grade-card", "analysis"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setResultTab(tab)}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                resultTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {resultTab === "results" && (
          <DataTable
            columns={[
              { 
                key: "studentId", 
                header: "Student",
                render: (row: SemesterResult) => students.find(s => s.id === row.studentId)?.fullName || row.studentId
              },
              { key: "semesterOrYear", header: "Semester" },
              { key: "sgpa", header: "SGPA", render: (row: SemesterResult) => row.sgpa.toFixed(2) },
              { 
                key: "resultStatus", 
                header: "Status",
                render: (row: SemesterResult) => (
                  <StatusPill 
                    status={getStatusCategory(row.resultStatus)}
                    label={row.resultStatus}
                  />
                )
              }
            ]}
            data={results}
            emptyMessage="No results published yet."
          />
        )}

        {resultTab === "grade-card" && (
          <div className="space-y-4">
            {results.slice(0, 3).map(res => {
              const student = students.find(s => s.id === res.studentId);
              return (
                <div key={res.id} className="border rounded-lg p-4 bg-muted/10">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold">{student?.fullName}</h4>
                      <div className="text-xs text-muted-foreground">Roll No: {student?.rollNumber} • {res.semesterOrYear}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">SGPA: {res.sgpa.toFixed(2)}</div>
                      <StatusPill 
                        status={getStatusCategory(res.resultStatus)}
                        label={res.resultStatus}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {res.subjects.map((sub: SubjectResult, i) => (
                      <div key={i} className="flex justify-between text-sm bg-background border p-2 rounded">
                        <span className="truncate pr-2" title={subjects.find(s => s.id === sub.subjectId)?.name}>
                          {subjects.find(s => s.id === sub.subjectId)?.code}
                        </span>
                        <span className="font-medium shrink-0">{sub.grade} ({sub.marksObtained})</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {results.length === 0 && <div className="text-center text-sm text-muted-foreground py-8">No grade cards available.</div>}
            {results.length > 3 && <div className="text-center text-sm text-muted-foreground">Showing 3 most recent grade cards.</div>}
          </div>
        )}

        {resultTab === "analysis" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/10">
              <div className="text-3xl font-bold text-primary mb-2">
                {results.length > 0 ? ((results.filter(r => r.resultStatus === "pass").length / results.length) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Pass Percentage</div>
            </div>
            <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/10">
              <div className="text-3xl font-bold text-primary mb-2">
                {results.length > 0 ? (results.reduce((acc, r) => acc + r.sgpa, 0) / results.length).toFixed(2) : "0.00"}
              </div>
              <div className="text-sm text-muted-foreground">Average SGPA</div>
            </div>
          </div>
        )}
      </Card>

      <Drawer open={isAddExamOpen} onClose={() => setIsAddExamOpen(false)} title="Add Exam">
        <form onSubmit={handleAddExam} className="space-y-4">
          <Input label="Exam Name" name="name" required />
          <Select 
            label="Subject" 
            name="subjectId" 
            required
            options={subjects.map(s => ({ label: `${s.code} - ${s.name}`, value: s.id }))}
          />
          <Input type="date" label="Date" name="date" required />
          <Select 
            label="Type" 
            name="type" 
            required 
            options={[
              { label: "Internal", value: "internal" },
              { label: "Practical", value: "practical" },
              { label: "Semester", value: "semester" }
            ]}
          />
          <Input type="number" min="1" label="Max Marks" name="maxMarks" required />
          <Input label="Room (Optional)" name="room" />
          <Input label="Invigilator (Optional)" name="invigilator" />
          <Select 
            label="Status" 
            name="status" 
            required 
            options={[
              { label: "Scheduled", value: "scheduled" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Completed", value: "completed" }
            ]}
          />
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition-colors">
              Save Exam
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
