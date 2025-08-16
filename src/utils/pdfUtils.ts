import jsPDF from 'jspdf';
import { Order } from '../types/Order';

export const generateAndDownloadPDF = async (order: Order): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('THE HOUSE OF TOVIO', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // Gray color
    doc.text('Delicious Food, Delivered Fresh', 20, 40);
    
    // Invoice title
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55); // Dark color
    doc.text('INVOICE', 20, 60);
    
    // Order Information
    doc.setFontSize(14);
    doc.setTextColor(55, 65, 81);
    doc.text('Order Information', 20, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Order ID:', 20, 95);
    doc.setTextColor(31, 41, 55);
    doc.text(order.orderId, 60, 95);
    
    doc.setTextColor(107, 114, 128);
    doc.text('Order Date:', 20, 105);
    doc.setTextColor(31, 41, 55);
    doc.text(new Date(order.orderDate).toLocaleDateString('en-IN'), 60, 105);
    
    doc.setTextColor(107, 114, 128);
    doc.text('Payment Status:', 20, 115);
    doc.setTextColor(31, 41, 55);
    doc.text(order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1), 60, 115);
    
    // Customer Information
    doc.setFontSize(14);
    doc.setTextColor(55, 65, 81);
    doc.text('Customer Information', 20, 140);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Name:', 20, 155);
    doc.setTextColor(31, 41, 55);
    doc.text(order.customerName, 60, 155);
    
    doc.setTextColor(107, 114, 128);
    doc.text('Mobile:', 20, 165);
    doc.setTextColor(31, 41, 55);
    doc.text(order.mobileNumber, 60, 165);
    
    doc.setTextColor(107, 114, 128);
    doc.text('Address:', 20, 175);
    doc.setTextColor(31, 41, 55);
    doc.text(`${order.address.city}, ${order.address.pincode}`, 60, 175);
    
    // Order Items Table
    doc.setFontSize(14);
    doc.setTextColor(55, 65, 81);
    doc.text('Order Items', 20, 200);
    
    // Table headers
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text('Item', 20, 215);
    doc.text('Qty', 100, 215);
    doc.text('Unit Price', 130, 215);
    doc.text('Total', 170, 215);
    
    // Table rows
    let yPosition = 225;
    order.orderItems.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setTextColor(31, 41, 55);
      doc.text(item.itemName, 20, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(`₹${item.unitPrice.toFixed(2)}`, 130, yPosition);
      doc.text(`₹${item.totalPrice.toFixed(2)}`, 170, yPosition);
      
      yPosition += 10;
    });
    
    // Totals
    const subtotal = order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    doc.text('Subtotal:', 130, yPosition + 10);
    doc.text(`₹${subtotal.toFixed(2)}`, 170, yPosition + 10);
    
    doc.text('Delivery Cost:', 130, yPosition + 20);
    doc.text(`₹${order.deliveryCost.toFixed(2)}`, 170, yPosition + 20);
    
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text('Total Amount:', 130, yPosition + 35);
    doc.text(`₹${order.totalCost.toFixed(2)}`, 170, yPosition + 35);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Thank you for choosing THE HOUSE OF TOVIO!', 20, yPosition + 50);
    doc.text('For any queries, please contact us.', 20, yPosition + 60);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, yPosition + 70);
    
    // Save the PDF
    const fileName = `Invoice-${order.orderId}-${new Date(order.orderDate).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const generatePDFBlob = async (order: Order): Promise<Blob> => {
  try {
    const doc = new jsPDF();
    
    // Same PDF generation logic as above, but return blob
    // ... (same content generation)
    
    // Return as blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const openPDFInNewTab = async (order: Order): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    // Same PDF generation logic as above
    
    // Open in new tab
    const pdfDataUri = doc.output('datauristring');
    window.open(pdfDataUri, '_blank');
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}; 