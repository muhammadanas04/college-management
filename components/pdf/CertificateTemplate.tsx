import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Student } from '@/types/student';

const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: 'Helvetica',
  },
  border: {
    borderWidth: 3,
    borderColor: '#2b6cb0',
    borderStyle: 'solid',
    padding: 2,
    height: '100%',
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: '#2b6cb0',
    borderStyle: 'solid',
    padding: 30,
    height: '100%',
    flexDirection: 'column',
    position: 'relative',
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 4,
  },
  address: {
    fontSize: 10,
    color: '#718096',
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  certificateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textDecoration: 'underline',
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 40,
  },
  metaBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaText: {
    fontSize: 12,
  },
  signaturesBlock: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    alignItems: 'center',
  },
  signatureText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

interface CertificateProps {
  title: string;
  student: Student;
  body: string;
  serialNumber: string;
  date: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CertificateTemplate = ({ title, student, body, serialNumber, date }: CertificateProps) => {
  // We accept `student` as per plan but it may be used conditionally or in the body text dynamically.
  return (

    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            
            <View style={styles.metaBlock}>
              <Text style={styles.metaText}>Serial No: {serialNumber}</Text>
              <Text style={styles.metaText}>Date: {date}</Text>
            </View>

            <View style={styles.headerBlock}>
              <Text style={styles.instName}>Tech University</Text>
              <Text style={styles.subtitle}>Affiliated to XYZ University</Text>
              <Text style={styles.address}>123 Education Lane, Knowledge City, State - 123456</Text>
            </View>
            
            <View style={styles.titleBlock}>
              <Text style={styles.certificateTitle}>{title}</Text>
            </View>
            
            <Text style={styles.bodyText}>
              {body}
            </Text>

            <View style={styles.signaturesBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureText}>Registrar</Text>
              </View>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureText}>Principal</Text>
              </View>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
};
