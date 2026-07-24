"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/form/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { getStatusCategory } from "@/lib/status-colors";
import { FeeStructureEntry, DueEntry, FeeCollection, Scholarship } from "@/types/fees";
import { pdf } from "@react-pdf/renderer";
import { ReceiptTemplate } from "@/components/pdf/ReceiptTemplate";
import { platform } from "@/lib/platform";

export default function FeesView() {
  const { 
    feeStructure, 
    feeCollections, 
    dues, 
    scholarships, 
    students,
    addFeeCollection,
    updateDue
  } = useAppStore();

  const [selectedDue, setSelectedDue] = useState<DueEntry | null>(null);
  const [paymentMode, setPaymentMode] = useState<"cash" | "online" | "cheque">("online");

  // Stat calculations
  const collectedThisTerm = useMemo(() => feeCollections.reduce((sum, fc) => sum + fc.amount, 0), [feeCollections]);
  const outstandingDues = useMemo(() => dues.reduce((sum, d) => sum + d.amountDue, 0), [dues]);
  const scholarshipsDisbursed = useMemo(() => 
    scholarships.filter(s => s.status === "disbursed").reduce((sum, s) => sum + s.amount, 0), 
  [scholarships]);

  const handleCollectFee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDue) return;

    const student = students.find(s => s.id === selectedDue.studentId);
    if (!student) return;

    const receiptNo = `REC-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];

    // 1. Record Fee Collection
    addFeeCollection({
      studentId: selectedDue.studentId,
      amount: selectedDue.amountDue,
      date,
      mode: paymentMode,
      receiptNo
    });

    // 2. Clear Due (in a real app we might partial pay, here we just set to 0)
    updateDue(selectedDue.id, { amountDue: 0 });
    
    setSelectedDue(null);

    // 3. Generate and Download PDF
    try {
      const blob = await pdf(
        <ReceiptTemplate 
          receiptNo={receiptNo}
          date={date}
          amount={selectedDue.amountDue}
          mode={paymentMode}
          studentName={`${student.fullName} (${student.rollNumber})`}
        />
      ).toBlob();
      
      await platform.downloadFile(blob, `receipt-${receiptNo}.pdf`);
      toast.success("Fee collected — receipt downloaded");
    } catch (err) {
      toast.error("Failed to generate receipt PDF");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Fees & Ledger</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Collected This Term" 
          value={`$${collectedThisTerm.toLocaleString()}`} 
          accentColor="#10b981" 
        />
        <StatCard 
          label="Outstanding Dues" 
          value={`$${outstandingDues.toLocaleString()}`} 
          accentColor={outstandingDues > 0 ? "#f43f5e" : "#10b981"} 
        />
        <StatCard 
          label="Scholarships Disbursed" 
          value={`$${scholarshipsDisbursed.toLocaleString()}`} 
          accentColor="#8b5cf6" 
        />
      </div>

      <Card title="Fee Structure">
        <DataTable
          columns={[
            { key: "course", header: "Course" },
            { key: "semesterOrYear", header: "Semester/Year" },
            { key: "feeType", header: "Fee Type" },
            { 
              key: "amount", 
              header: "Amount",
              render: (row: FeeStructureEntry) => `$${row.amount.toLocaleString()}`
            }
          ]}
          data={feeStructure}
          emptyMessage="No fee structure defined."
        />
      </Card>

      <Card title="Due List">
        <DataTable
          columns={[
            { 
              key: "studentId", 
              header: "Student",
              render: (row: DueEntry) => {
                const s = students.find(s => s.id === row.studentId);
                return s ? `${s.fullName} (${s.rollNumber})` : row.studentId;
              }
            },
            { 
              key: "amountDue", 
              header: "Amount Due",
              render: (row: DueEntry) => (
                <span className={row.amountDue > 0 ? "text-rose-500 font-medium" : "text-emerald-500 font-medium"}>
                  ${row.amountDue.toLocaleString()}
                </span>
              )
            },
            { key: "dueDate", header: "Due Date" },
            { 
              key: "status", 
              header: "Status",
              render: (row: DueEntry) => {
                if (row.amountDue === 0) return <StatusPill status={getStatusCategory("cleared")} label="Cleared" />;
                const label = row.daysOverdue > 0 ? `${row.daysOverdue} days overdue` : "Pending";
                return <StatusPill status={getStatusCategory(row.daysOverdue > 0 ? "overdue" : "pending")} label={label} />;
              }
            },
            {
              key: "actions",
              header: "Actions",
              render: (row: DueEntry) => row.amountDue > 0 && (
                <button 
                  onClick={() => setSelectedDue(row)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Collect Fee
                </button>
              )
            }
          ]}
          data={dues}
          emptyMessage="No dues found."
        />
      </Card>

      <Card title="Scholarship Details">
        <DataTable
          columns={[
            { 
              key: "studentId", 
              header: "Student",
              render: (row: Scholarship) => {
                const s = students.find(s => s.id === row.studentId);
                return s ? `${s.fullName} (${s.rollNumber})` : row.studentId;
              }
            },
            { key: "name", header: "Scholarship Name" },
            { 
              key: "amount", 
              header: "Amount",
              render: (row: Scholarship) => `$${row.amount.toLocaleString()}`
            },
            { 
              key: "status", 
              header: "Status",
              render: (row: Scholarship) => (
                <StatusPill 
                  status={getStatusCategory(row.status)}
                  label={row.status}
                />
              )
            }
          ]}
          data={scholarships}
          emptyMessage="No scholarships found."
        />
      </Card>

      <Card title="Ledger Transaction Log">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {[...feeCollections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(fc => {
            const student = students.find(s => s.id === fc.studentId);
            return (
              <div key={fc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Receipt: {fc.receiptNo}</span>
                  <span className="text-xs text-muted-foreground">
                    {student ? `${student.fullName} (${student.rollNumber})` : fc.studentId}
                  </span>
                </div>
                <div className="flex flex-col sm:items-end text-left sm:text-right">
                  <span className="text-sm font-bold text-emerald-600">+${fc.amount.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground flex gap-2">
                    <span>{fc.date}</span>
                    <span className="uppercase bg-muted px-1.5 rounded">{fc.mode}</span>
                  </span>
                </div>
              </div>
            );
          })}
          {feeCollections.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">No transactions found</div>
          )}
        </div>
      </Card>

      <Drawer open={!!selectedDue} onClose={() => setSelectedDue(null)} title="Collect Fee">
        {selectedDue && (
          <form onSubmit={handleCollectFee} className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-medium">{students.find(s => s.id === selectedDue.studentId)?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Due:</span>
                <span className="font-bold text-rose-600">${selectedDue.amountDue.toLocaleString()}</span>
              </div>
            </div>

            <Select 
              label="Payment Mode" 
              name="mode" 
              required 
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as any)}
              options={[
                { label: "Online", value: "online" },
                { label: "Cash", value: "cash" },
                { label: "Cheque", value: "cheque" }
              ]}
            />
            
            <div className="pt-4 border-t flex flex-col gap-2">
              <button type="submit" className="w-full bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 font-medium">
                Confirm Payment & Generate Receipt
              </button>
              <button type="button" onClick={() => setSelectedDue(null)} className="w-full px-4 py-2 rounded text-sm hover:bg-muted font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}
