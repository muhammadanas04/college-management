import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Student } from '@/types';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 40, fontFamily: 'Helvetica' },
  header: { fontSize: 24, marginBottom: 10, textAlign: 'center', fontWeight: 'bold', color: '#1a365d' },
  subheader: { fontSize: 16, textAlign: 'center', color: '#4A5568', marginBottom: 30 },
  section: { marginVertical: 10, padding: 10, fontSize: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 10 },
  label: { color: '#4A5568', width: '40%' },
  value: { fontWeight: 'bold', color: '#1A202C', width: '60%' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 10, color: '#A0AEC0', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 }
});

interface GenericReportProps {
  title: string;
  student: Student;
  additionalRows?: { label: string; value: string }[];
  textBody?: string;
}

export const GenericReportTemplate = ({ title, student, additionalRows, textBody }: GenericReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Campus Ledger</Text>
      <Text style={styles.subheader}>{title}</Text>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{student.fullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Roll Number:</Text>
          <Text style={styles.value}>{student.rollNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Department:</Text>
          <Text style={styles.value}>{student.department}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Course / Semester:</Text>
          <Text style={styles.value}>{student.course} - {student.semesterOrYear}</Text>
        </View>
        
        {additionalRows?.map((row, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.label}>{row.label}:</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </View>

      {textBody && (
        <View style={{ marginTop: 20, padding: 10 }}>
          <Text style={{ fontSize: 12, lineHeight: 1.5, textAlign: 'justify' }}>{textBody}</Text>
        </View>
      )}
      
      <Text style={styles.footer}>
        This is an automatically generated document. Campus Ledger {new Date().getFullYear()}
      </Text>
    </Page>
  </Document>
);
