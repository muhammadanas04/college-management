import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    flexDirection: 'column', 
    padding: 40,
    fontFamily: 'Helvetica',
  },
  institutionHeader: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2b6cb0',
    paddingBottom: 10,
  },
  institutionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  institutionAddress: {
    fontSize: 10,
    color: '#4a5568',
    marginTop: 4,
  },
  header: { 
    fontSize: 18, 
    marginBottom: 10, 
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1a365d'
  },
  receiptNoContainer: {
    backgroundColor: '#ebf8ff',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 20,
  },
  receiptNo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  section: { 
    marginVertical: 10,
    padding: 10, 
    fontSize: 12,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0', 
    paddingVertical: 8 
  },
  label: { 
    color: '#4A5568',
    width: '40%',
  },
  value: { 
    fontWeight: 'bold',
    color: '#1A202C',
    width: '60%',
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e0',
    paddingBottom: 4,
    marginBottom: 8,
    marginTop: 16,
  },
  tableColDesc: {
    width: '70%',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  tableColAmt: {
    width: '30%',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4a5568',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  tableCellDesc: {
    width: '70%',
    fontSize: 11,
    color: '#2d3748',
  },
  tableCellAmt: {
    width: '30%',
    fontSize: 11,
    color: '#2d3748',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#cbd5e0',
    marginTop: 4,
  },
  totalLabel: {
    width: '70%',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: '30%',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'right',
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
  items?: { description: string; amount: number }[];
}

export const ReceiptTemplate = ({ receiptNo, date, amount, mode, studentName, items }: ReceiptProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.institutionHeader}>
        <Text style={styles.institutionName}>Tech University</Text>
        <Text style={styles.institutionAddress}>123 Education Lane, Knowledge City, State - 123456</Text>
      </View>
      
      <Text style={styles.header}>FEE RECEIPT</Text>
      
      <View style={styles.receiptNoContainer}>
        <Text style={styles.receiptNo}>Receipt No: {receiptNo}</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{studentName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Mode:</Text>
          <Text style={styles.value}>{mode.toUpperCase()}</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableColDesc}>Description</Text>
          <Text style={styles.tableColAmt}>Amount (₹)</Text>
        </View>
        
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellDesc}>{item.description}</Text>
              <Text style={styles.tableCellAmt}>{item.amount.toLocaleString()}</Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.tableCellDesc}>Fee Payment</Text>
            <Text style={styles.tableCellAmt}>{amount.toLocaleString()}</Text>
          </View>
        )}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Paid:</Text>
          <Text style={styles.totalValue}>₹{amount.toLocaleString()}</Text>
        </View>
      </View>
      
      <Text style={styles.footer}>
        This is a computer generated document. No signature is required.
      </Text>
    </Page>
  </Document>
);
