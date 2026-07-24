import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Student } from '@/types/student';

// Custom page size 85.6mm × 53.98mm = approx 242.64 x 153.01 points
const styles = StyleSheet.create({
  page: { 
    flexDirection: 'column',
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  header: {
    backgroundColor: '#1a365d',
    padding: 5,
    marginBottom: 10,
    borderRadius: 2,
  },
  instName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bodyRow: {
    flexDirection: 'row',
  },
  photoCol: {
    width: '30%',
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 50,
    height: 60,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  photoText: {
    fontSize: 8,
    color: '#718096',
  },
  infoCol: {
    width: '70%',
    paddingLeft: 10,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
    width: 45,
    color: '#4a5568',
  },
  value: {
    fontSize: 8,
    color: '#1a202c',
    flex: 1,
  },
  backContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBlock: {
    width: '100%',
    marginBottom: 10,
  },
  backLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 2,
  },
  backValue: {
    fontSize: 8,
    color: '#1a202c',
  },
  barcodePlaceholder: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#000',
    alignItems: 'center',
  },
  barcodeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    letterSpacing: 2,
  },
});

interface IdCardProps {
  student: Student;
}

export const IdCardTemplate = ({ student }: IdCardProps) => {
  return (
    <Document>
      {/* Front Page */}
      <Page size={[242.64, 153.01]} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.instName}>Tech University</Text>
        </View>
        <View style={styles.bodyRow}>
          <View style={styles.photoCol}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoText}>Photo</Text>
            </View>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.studentName}>{student.fullName}</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Roll No:</Text>
              <Text style={styles.value}>{student.rollNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Dept:</Text>
              <Text style={styles.value}>{student.department}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Course:</Text>
              <Text style={styles.value}>{student.course}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Blood Grp:</Text>
              <Text style={styles.value}>{student.bloodGroup}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Back Page */}
      <Page size={[242.64, 153.01]} style={styles.page}>
        <View style={styles.backContainer}>
          <View style={styles.backBlock}>
            <Text style={styles.backLabel}>Address:</Text>
            <Text style={styles.backValue}>{student.address}</Text>
          </View>
          <View style={styles.backBlock}>
            <Text style={styles.backLabel}>Mobile No:</Text>
            <Text style={styles.backValue}>{student.mobileNumber}</Text>
          </View>
          <View style={styles.backBlock}>
            <Text style={styles.backLabel}>Emergency Contact:</Text>
            <Text style={styles.backValue}>+1 234 567 8900</Text> {/* Placeholder if not in model */}
          </View>
          
          <View style={styles.barcodePlaceholder}>
            <Text style={styles.barcodeText}>BARCODE</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
