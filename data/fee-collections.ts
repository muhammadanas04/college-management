import { FeeCollection } from '../types';

export const feeCollections: FeeCollection[] = [
  { id: "fc_001", studentId: "stu_001", amount: 67500, date: "2024-07-15", mode: "online", receiptNo: "RCP2024001" },
  { id: "fc_002", studentId: "stu_002", amount: 67500, date: "2024-07-18", mode: "cheque", receiptNo: "RCP2024002" },
  { id: "fc_003", studentId: "stu_004", amount: 31500, date: "2024-07-20", mode: "cash", receiptNo: "RCP2024003" },
  // stu_003 and stu_005 have dues
];
