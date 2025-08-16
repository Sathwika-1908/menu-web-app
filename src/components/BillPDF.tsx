import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Order } from '../types/Order';

// Register a default font
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    width: '30%',
  },
  value: {
    fontSize: 10,
    color: '#1f2937',
    width: '70%',
    fontWeight: 'bold',
  },
  itemsTable: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #f3f4f6',
  },
  tableCell: {
    fontSize: 10,
    color: '#1f2937',
  },
  itemName: { width: '40%' },
  quantity: { width: '15%', textAlign: 'center' },
  unitPrice: { width: '20%', textAlign: 'right' },
  totalPrice: { width: '25%', textAlign: 'right' },
  totals: {
    marginTop: 20,
    borderTop: '2 solid #e5e7eb',
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  },
});

interface BillPDFProps {
  order: Order;
}

const BillPDF: React.FC<BillPDFProps> = ({ order }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>THE HOUSE OF TOVIO</Text>
          <Text style={styles.companyTagline}>Delicious Food, Delivered Fresh</Text>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>{order.orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>{formatDate(order.orderDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Mode:</Text>
            <Text style={styles.value}>
              {order.modeOfPayment.charAt(0).toUpperCase() + order.modeOfPayment.slice(1)}
            </Text>
          </View>
          {order.referenceNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Reference No:</Text>
              <Text style={styles.value}>{order.referenceNumber}</Text>
            </View>
          )}
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{order.customerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{order.mobileNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>
              {order.address.city}, {order.address.pincode}
            </Text>
          </View>
          {order.deliveryDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Delivery Date:</Text>
              <Text style={styles.value}>{formatDate(order.deliveryDate)}</Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.itemName]}>Item</Text>
              <Text style={[styles.tableHeaderCell, styles.quantity]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.unitPrice]}>Unit Price</Text>
              <Text style={[styles.tableHeaderCell, styles.totalPrice]}>Total</Text>
            </View>
            {order.orderItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.itemName]}>{item.itemName}</Text>
                <Text style={[styles.tableCell, styles.quantity]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.unitPrice]}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={[styles.tableCell, styles.totalPrice]}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0))}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Cost:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.deliveryCost)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totalCost)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for choosing THE HOUSE OF TOVIO!</Text>
          <Text>For any queries, please contact us.</Text>
          <Text>Generated on: {formatDate(new Date())}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BillPDF; 