import emailjs from 'emailjs-com';
import { Order } from '../types/Order';
import { EMAILJS_CONFIG } from '../config/emailjs';

export interface EmailData extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  order_id: string;
  order_date: string;
  customer_name: string;
  total_amount: string;
  payment_status: string;
  payment_mode: string;
  delivery_address: string;
  order_items: string;
  company_name: string;
  company_email: string;
  company_phone: string;
}

export const sendOrderReceipt = async (
  order: Order,
  customerEmail: string,
  customerName: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' ||
        EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID' ||
        EMAILJS_CONFIG.USER_ID === 'YOUR_EMAILJS_USER_ID') {
      return {
        success: false,
        message: 'EmailJS not configured. Please update the configuration file.'
      };
    }

    // Format order items for email
    const orderItemsText = order.orderItems
      .map(item => `${item.itemName} x${item.quantity} - ₹${item.totalPrice.toFixed(2)}`)
      .join('\n');

    // Format delivery address
    const deliveryAddress = `${order.address.city}, ${order.address.pincode}`;

    // Prepare email data
    const emailData: EmailData = {
      to_email: customerEmail,
      to_name: customerName,
      order_id: order.orderId,
      order_date: new Date(order.orderDate).toLocaleDateString('en-IN'),
      customer_name: order.customerName,
      total_amount: `₹${order.totalCost.toFixed(2)}`,
      payment_status: order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1),
      payment_mode: order.modeOfPayment.charAt(0).toUpperCase() + order.modeOfPayment.slice(1),
      delivery_address: deliveryAddress,
      order_items: orderItemsText,
      company_name: EMAILJS_CONFIG.COMPANY.NAME,
      company_email: EMAILJS_CONFIG.COMPANY.EMAIL,
      company_phone: EMAILJS_CONFIG.COMPANY.PHONE,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      emailData,
      EMAILJS_CONFIG.USER_ID
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Order receipt sent successfully!'
      };
    } else {
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

// Initialize EmailJS
export const initializeEmailJS = (): void => {
  if (EMAILJS_CONFIG.USER_ID !== 'YOUR_EMAILJS_USER_ID') {
    emailjs.init(EMAILJS_CONFIG.USER_ID);
  }
};

// Test email connection
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    // Check if configured
    if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID') {
      return false;
    }

    // Try to send a test email
    const testData = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      order_id: 'TEST-001',
      order_date: new Date().toLocaleDateString('en-IN'),
      customer_name: 'Test Customer',
      total_amount: '₹100.00',
      payment_status: 'Paid',
      payment_mode: 'Cash',
      delivery_address: 'Test City, 123456',
      order_items: 'Test Item x1 - ₹100.00',
      company_name: EMAILJS_CONFIG.COMPANY.NAME,
      company_email: EMAILJS_CONFIG.COMPANY.EMAIL,
      company_phone: EMAILJS_CONFIG.COMPANY.PHONE,
    };

    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      testData,
      EMAILJS_CONFIG.USER_ID
    );

    return true;
  } catch (error) {
    console.error('Email connection test failed:', error);
    return false;
  }
}; 