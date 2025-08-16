// EmailJS Configuration
// Get these values from your EmailJS account at https://www.emailjs.com/

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (e.g., Gmail, Outlook, etc.)
  SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
  
  // Your EmailJS Template ID (create a template in EmailJS dashboard)
  TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',
  
  // Your EmailJS User ID (Public Key)
  USER_ID: 'YOUR_EMAILJS_USER_ID',
  
  // Company Information (customize these)
  COMPANY: {
    NAME: 'THE HOUSE OF TOVIO',
    EMAIL: 'orders@houseoftovio.com',
    PHONE: '+91 98765 43210',
    ADDRESS: 'Your Restaurant Address',
    WEBSITE: 'https://yourwebsite.com'
  }
};

// EmailJS Template Variables
// These should match the variables in your EmailJS template
export const EMAIL_TEMPLATE_VARIABLES = {
  to_email: '{{to_email}}',
  to_name: '{{to_name}}',
  order_id: '{{order_id}}',
  order_date: '{{order_date}}',
  customer_name: '{{customer_name}}',
  total_amount: '{{total_amount}}',
  payment_status: '{{payment_status}}',
  payment_mode: '{{payment_mode}}',
  delivery_address: '{{delivery_address}}',
  order_items: '{{order_items}}',
  company_name: '{{company_name}}',
  company_email: '{{company_email}}',
  company_phone: '{{company_phone}}'
};

// Instructions for setting up EmailJS:
/*
1. Go to https://www.emailjs.com/ and create an account
2. Add your email service (Gmail, Outlook, etc.)
3. Create an email template with the variables above
4. Copy your Service ID, Template ID, and User ID
5. Update the EMAILJS_CONFIG values below
6. Test the email functionality

Example EmailJS Template:
Subject: Order Receipt - {{order_id}}

Dear {{to_name}},

Thank you for your order from {{company_name}}!

Order Details:
- Order ID: {{order_id}}
- Order Date: {{order_date}}
- Total Amount: {{total_amount}}
- Payment Status: {{payment_status}}
- Payment Mode: {{payment_mode}}

Delivery Address: {{delivery_address}}

Order Items:
{{order_items}}

If you have any questions, please contact us at {{company_email}} or {{company_phone}}.

Best regards,
{{company_name}} Team
*/ 