"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/form/Select";
import { pdf } from "@react-pdf/renderer";
import { GenericReportTemplate } from "@/components/pdf/ReportTemplates";
import { FileBarChart, User, CheckSquare, CreditCard, BookOpen, UserCircle, Library, FileText, Award } from "lucide-react";

const reportTypes = [
  { id: "student-profile", title: "Student Profile", icon: User },
  { id: "attendance", title: "Attendance Report", icon: CheckSquare },
  { id: "fees", title: "Fee Report", icon: CreditCard },
  { id: "marksheet", title: "Marksheet", icon: FileBarChart },
  { id: "id-card", title: "ID Card", icon: UserCircle },
  { id: "library-card", title: "Library Card", icon: Library },
  { id: "bonafide", title: "Bonafide Certificate", icon: BookOpen },
  { id: "transfer", title: "Transfer Certificate", icon: FileText },
  { id: "character", title: "Character Certificate", icon: Award },
];

export default function ReportsView() {
  const { students } = useAppStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleDownload = async (reportId: string, title: string) => {
    if (!selectedStudent) {
      alert("Please select a student first.");
      return;
    }

    setIsGenerating(reportId);

    try {
      let textBody = "";
      if (reportId === "bonafide") {
        textBody = `This is to certify that ${selectedStudent.fullName}, son/daughter of ${selectedStudent.fathersName}, is a bonafide student of this institution studying in ${selectedStudent.course} (${selectedStudent.semesterOrYear}). To the best of our knowledge, they bear a good moral character.`;
      } else if (reportId === "transfer") {
        textBody = `This is to certify that ${selectedStudent.fullName} has left the institution. They were studying in ${selectedStudent.course}. All dues have been cleared.`;
      } else if (reportId === "character") {
        textBody = `This is to certify that ${selectedStudent.fullName} has been a student of this institution. During their tenure, their conduct and character were found to be satisfactory.`;
      }

      const doc = <GenericReportTemplate title={title} student={selectedStudent} textBody={textBody} />;
      const blob = await pdf(doc).toBlob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = selectedStudent.fullName.replace(/\s+/g, '_');
      a.download = `${safeName}_${selectedStudent.rollNumber}_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Reports & Documents</h2>
      </div>

      <Card title="Student Selection" className="bg-muted/30">
        <div className="max-w-md">
          <Select 
            label="Select Student for Reports" 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            options={[
              { label: "--- Select a Student ---", value: "" },
              ...students.map(s => ({ label: `${s.fullName} (${s.rollNumber})`, value: s.id }))
            ]}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} title={report.title}>
              <div className="flex flex-col items-center py-6 gap-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <Icon size={32} />
                </div>
                <p className="text-sm text-muted-foreground px-4">
                  Generate and download the {report.title.toLowerCase()} as a PDF document.
                </p>
                <button
                  onClick={() => handleDownload(report.id, report.title)}
                  disabled={!selectedStudentId || isGenerating === report.id}
                  className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isGenerating === report.id ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
