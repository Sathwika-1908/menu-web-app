import { ref, push, get, update, remove } from 'firebase/database';
import { database } from '../firebase';
import { Order, OrderFormData } from '../types/Order';

export const orderService = {
  // Test Firebase connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Firebase connection...');
      const testRef = ref(database, 'test');
      await update(testRef, { timestamp: Date.now() });
      console.log('Firebase connection test successful');
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  },

  // Create a new order
  async createOrder(orderData: OrderFormData): Promise<string> {
    try {
      console.log('Creating order with data:', orderData);
      
      const ordersRef = ref(database, 'orders');
      console.log('Orders reference created:', ordersRef);
      
      const newOrderRef = push(ordersRef);
      console.log('New order reference created:', newOrderRef);
      
      const order: Omit<Order, 'id'> = {
        orderId: orderData.orderId,
        orderDate: new Date(orderData.orderDate),
        customerName: orderData.customerName,
        mobileNumber: orderData.mobileNumber,
        address: {
          city: orderData.city,
          pincode: orderData.pincode,
        },
        orderItems: orderData.orderItems,
        deliveryCost: orderData.deliveryCost,
        totalCost: orderData.deliveryCost + orderData.orderItems.reduce((sum, item) => sum + item.totalPrice, 0),
        paymentStatus: orderData.paymentStatus,
        modeOfPayment: orderData.modeOfPayment,
        referenceNumber: orderData.referenceNumber,
        deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : undefined,
        feedback: orderData.feedback,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Order object prepared:', order);
      
      await update(newOrderRef, order);
      console.log('Order saved successfully with ID:', newOrderRef.key);
      
      return newOrderRef.key!;
    } catch (error) {
      console.error('Error in createOrder:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'No code',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      throw error;
    }
  },

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      const orders: Order[] = [];
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        orders.push({
          id: childSnapshot.key!,
          ...order,
          orderDate: new Date(order.orderDate),
          deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        });
      });
      return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
    }
    
    return [];
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = ref(database, `orders/${orderId}`);
    const snapshot = await get(orderRef);
    
    if (snapshot.exists()) {
      const order = snapshot.val();
      return {
        id: snapshot.key!,
        ...order,
        orderDate: new Date(order.orderDate),
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      };
    }
    
    return null;
  },

  // Update order
  async updateOrder(orderId: string, orderData: Partial<OrderFormData>): Promise<void> {
    const orderRef = ref(database, `orders/${orderId}`);
    
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (orderData.orderId !== undefined) updateData.orderId = orderData.orderId;
    if (orderData.orderDate !== undefined) updateData.orderDate = new Date(orderData.orderDate);
    if (orderData.customerName !== undefined) updateData.customerName = orderData.customerName;
    if (orderData.mobileNumber !== undefined) updateData.mobileNumber = orderData.mobileNumber;
    if (orderData.city !== undefined) updateData.address = { city: orderData.city, pincode: orderData.pincode || '' };
    if (orderData.pincode !== undefined) updateData.address = { city: orderData.city || '', pincode: orderData.pincode };
    if (orderData.orderItems !== undefined) updateData.orderItems = orderData.orderItems;
    if (orderData.deliveryCost !== undefined) updateData.deliveryCost = orderData.deliveryCost;
    if (orderData.paymentStatus !== undefined) updateData.paymentStatus = orderData.paymentStatus;
    if (orderData.modeOfPayment !== undefined) updateData.modeOfPayment = orderData.modeOfPayment;
    if (orderData.referenceNumber !== undefined) updateData.referenceNumber = orderData.referenceNumber;
    if (orderData.deliveryDate !== undefined) updateData.deliveryDate = orderData.deliveryDate ? new Date(orderData.deliveryDate) : undefined;
    if (orderData.feedback !== undefined) updateData.feedback = orderData.feedback;

    // Recalculate total cost if items or delivery cost changed
    if (orderData.orderItems !== undefined || orderData.deliveryCost !== undefined) {
      const currentOrder = await this.getOrderById(orderId);
      if (currentOrder) {
        const items = orderData.orderItems || currentOrder.orderItems;
        const deliveryCost = orderData.deliveryCost !== undefined ? orderData.deliveryCost : currentOrder.deliveryCost;
        updateData.totalCost = deliveryCost + items.reduce((sum, item) => sum + item.totalPrice, 0);
      }
    }

    await update(orderRef, updateData);
  },

  // Delete order
  async deleteOrder(orderId: string): Promise<void> {
    const orderRef = ref(database, `orders/${orderId}`);
    await remove(orderRef);
  },

  // Search orders by customer name or order ID
  async searchOrders(searchTerm: string): Promise<Order[]> {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      const orders: Order[] = [];
      const searchLower = searchTerm.toLowerCase();
      
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        if (
          order.customerName.toLowerCase().includes(searchLower) ||
          order.orderId.toLowerCase().includes(searchLower) ||
          order.mobileNumber.includes(searchTerm)
        ) {
          orders.push({
            id: childSnapshot.key!,
            ...order,
            orderDate: new Date(order.orderDate),
            deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
          });
        }
      });
      
      return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
    }
    
    return [];
  },

  // Get orders by date range
  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      const orders: Order[] = [];
      
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        const orderDate = new Date(order.orderDate);
        
        if (orderDate >= startDate && orderDate <= endDate) {
          orders.push({
            id: childSnapshot.key!,
            ...order,
            orderDate: orderDate,
            deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
          });
        }
      });
      
      return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
    }
    
    return [];
  },
}; 