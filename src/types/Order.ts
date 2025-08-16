export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderId: string;
  orderDate: Date;
  customerName: string;
  mobileNumber: string;
  address: {
    city: string;
    pincode: string;
  };
  orderItems: OrderItem[];
  deliveryCost: number;
  totalCost: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  modeOfPayment: 'cash' | 'card' | 'upi' | 'online';
  referenceNumber?: string;
  deliveryDate?: Date;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFormData {
  orderId: string;
  orderDate: string;
  customerName: string;
  mobileNumber: string;
  city: string;
  pincode: string;
  orderItems: OrderItem[];
  deliveryCost: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  modeOfPayment: 'cash' | 'card' | 'upi' | 'online';
  referenceNumber: string;
  deliveryDate: string;
  feedback: string;
} 