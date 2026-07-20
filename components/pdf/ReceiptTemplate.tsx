import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    flexDirection: 'column', 
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: { 
    fontSize: 24, 
    marginBottom: 10, 
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1a365d'
  },
  subheader: {
    fontSize: 12,
    textAlign: 'center',
    color: '#718096',
    marginBottom: 30
  },
  section: { 
    marginVertical: 10,
    padding: 10, 
    fontSize: 12 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0', 
    paddingVertical: 10 
  },
  label: { 
    color: '#4A5568' 
  },
  value: { 
    fontWeight: 'bold',
    color: '#1A202C' 
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#A0AEC0',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10
  }
});

interface ReceiptProps {
  receiptNo: string;
  date: string;
  amount: number;
  mode: string;
  studentName: string;
}

export const ReceiptTemplate = ({ receiptNo, date, amount, mode, studentName }: ReceiptProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Campus Ledger</Text>
      <Text style={styles.subheader}>Fee Receipt</Text>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Receipt No:</Text>
          <Text style={styles.value}>{receiptNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{studentName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>${amount.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Mode:</Text>
          <Text style={styles.value}>{mode.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.footer}>
        This is an automatically generated receipt. Thank you for your payment.
      </Text>
    </Page>
  </Document>
);
