import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Student } from '@/types/student';
import { SemesterResult } from '@/types/exam';
import { Subject } from '@/types/academics';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica',
  },
  header: { 
    textAlign: 'center', 
    marginBottom: 20 
  },
  instName: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: { 
    fontSize: 16, 
    marginTop: 5,
    textDecoration: 'underline'
  },
  infoBlock: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#000', 
    padding: 10 
  },
  infoCol: { 
    width: '50%', 
    marginBottom: 8 
  },
  infoText: { 
    fontSize: 10 
  },
  infoLabel: { 
    fontWeight: 'bold' 
  },
  table: { 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#000' 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000' 
  },
  tableRowLast: {
    flexDirection: 'row', 
  },
  tableHeader: { 
    backgroundColor: '#f0f0f0', 
  },
  tableCell: { 
    padding: 5, 
    fontSize: 10, 
    borderRightWidth: 1, 
    borderRightColor: '#000' 
  },
  tableCellLast: {
    padding: 5, 
    fontSize: 10, 
  },
  tableCellHeader: {
    fontWeight: 'bold',
  },
  colCode: { width: '20%' },
  colName: { width: '40%' },
  colMax: { width: '15%', textAlign: 'center' },
  colObt: { width: '15%', textAlign: 'center' },
  colGr: { width: '10%', textAlign: 'center' },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#000', 
    borderTopWidth: 0 
  },
  footerText: { 
    fontSize: 12, 
    fontWeight: 'bold' 
  }
});

interface MarksheetProps {
  student: Student;
  result: SemesterResult;
  subjects: Subject[];
}

export const MarksheetTemplate = ({ student, result, subjects }: MarksheetProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.instName}>Tech University</Text>
          <Text style={styles.title}>Marksheet</Text>
        </View>

        <View style={styles.infoBlock}>
          <View style={styles.infoCol}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Name: </Text>{student.fullName}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Roll No: </Text>{student.rollNumber}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Department: </Text>{student.department}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Course: </Text>{student.course}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Semester: </Text>{student.semesterOrYear}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableCellHeader, styles.colCode]}>Subject Code</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader, styles.colName]}>Subject Name</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader, styles.colMax]}>Max Marks</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader, styles.colObt]}>Marks Obtained</Text>
            <Text style={[styles.tableCellLast, styles.tableCellHeader, styles.colGr]}>Grade</Text>
          </View>

          {result.subjects.map((subRes, idx) => {
            const subject = subjects.find(s => s.id === subRes.subjectId);
            const isLast = idx === result.subjects.length - 1;
            return (
              <View style={isLast ? styles.tableRowLast : styles.tableRow} key={idx}>
                <Text style={[styles.tableCell, styles.colCode]}>{subject?.code || '-'}</Text>
                <Text style={[styles.tableCell, styles.colName]}>{subject?.name || '-'}</Text>
                <Text style={[styles.tableCell, styles.colMax]}>{subRes.maxMarks}</Text>
                <Text style={[styles.tableCell, styles.colObt]}>{subRes.marksObtained}</Text>
                <Text style={[styles.tableCellLast, styles.colGr]}>{subRes.grade}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SGPA: {result.sgpa.toFixed(2)}</Text>
          <Text style={styles.footerText}>Result Status: {result.resultStatus.toUpperCase()}</Text>
        </View>
      </Page>
    </Document>
  );
};
