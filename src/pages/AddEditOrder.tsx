import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Package, User, CreditCard, MessageSquare } from 'lucide-react';
import { orderService } from '../services/orderService';
import { menuService } from '../services/menuService';
import { OrderFormData, OrderItem } from '../types/Order';
import { MenuItem } from '../types/MenuItem';
import { generateAndDownloadPDF } from '../utils/pdfUtils';
import { sendOrderReceipt } from '../services/emailService';
import { Order } from '../types/Order';

const AddEditOrder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<OrderFormData>({
    orderId: '',
    orderDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerEmail: '', // Added email field
    mobileNumber: '',
    city: '',
    pincode: '',
    orderItems: [],
    deliveryCost: 0,
    paymentStatus: 'pending',
    modeOfPayment: 'cash',
    referenceNumber: '',
    deliveryDate: '',
    feedback: '',
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadOrder = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const order = await orderService.getOrderById(id);
      if (order) {
        setFormData({
          orderId: order.orderId,
          orderDate: order.orderDate.toISOString().split('T')[0],
          customerName: order.customerName,
          customerEmail: order.customerEmail || '', // Load email
          mobileNumber: order.mobileNumber,
          city: order.address.city,
          pincode: order.address.pincode,
          orderItems: order.orderItems,
          deliveryCost: order.deliveryCost,
          paymentStatus: order.paymentStatus,
          modeOfPayment: order.modeOfPayment,
          referenceNumber: order.referenceNumber || '',
          deliveryDate: order.deliveryDate ? order.deliveryDate.toISOString().split('T')[0] : '',
          feedback: order.feedback || '',
        });
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMenuItems();
    if (isEditing && id) {
      loadOrder();
    }
  }, [id, isEditing, loadOrder]);

  const loadMenuItems = async () => {
    try {
      const items = await new Promise<MenuItem[]>((resolve) => {
        const unsubscribe = menuService.subscribeToMenuItems((items) => {
          resolve(items.filter(item => item.isAvailable));
          unsubscribe();
        });
      });
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderId.trim()) newErrors.orderId = 'Order ID is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (formData.orderItems.length === 0) newErrors.orderItems = 'At least one item is required';
    if (formData.deliveryCost < 0) newErrors.deliveryCost = 'Delivery cost cannot be negative';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.customerEmail.trim() && !emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      if (isEditing && id) {
        await orderService.updateOrder(id, formData);
        alert('Order updated successfully!');
        navigate('/orders');
      } else {
        // Create new order
        const orderId = await orderService.createOrder(formData);
        
        // Create the complete order object for PDF and email
        const newOrder: Order = {
          id: orderId,
          orderId: formData.orderId,
          orderDate: new Date(formData.orderDate),
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          mobileNumber: formData.mobileNumber,
          address: {
            city: formData.city,
            pincode: formData.pincode,
          },
          orderItems: formData.orderItems,
          deliveryCost: formData.deliveryCost,
          totalCost: calculateTotalCost(),
          paymentStatus: formData.paymentStatus,
          modeOfPayment: formData.modeOfPayment,
          referenceNumber: formData.referenceNumber,
          deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : undefined,
          feedback: formData.feedback,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        alert('Order created successfully!');
        
        // Generate PDF and send email after successful order creation
        try {
          // Generate and download PDF
          await generateAndDownloadPDF(newOrder);
          
          // Send email receipt
          const emailResult = await sendOrderReceipt(
            newOrder,
            formData.customerEmail,
            formData.customerName
          );
          
          if (emailResult.success) {
            alert('Order receipt sent to customer email!');
          } else {
            alert(`Order created but email failed: ${emailResult.message}`);
          }
        } catch (error) {
          console.error('PDF/Email error:', error);
          alert('Order created successfully! PDF generation or email failed.');
        }
        
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addOrderItem = () => {
    const newItem: OrderItem = {
      itemId: '',
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setFormData(prev => ({
      ...prev,
      orderItems: [...prev.orderItems, newItem],
    }));
  };

  const removeOrderItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.orderItems];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Recalculate total price for this item
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
      }
      
      // Update item name when itemId changes
      if (field === 'itemId') {
        const selectedMenuItem = menuItems.find(item => item.id === value);
        if (selectedMenuItem) {
          newItems[index].itemName = selectedMenuItem.name;
          newItems[index].unitPrice = selectedMenuItem.price;
          newItems[index].totalPrice = newItems[index].quantity * selectedMenuItem.price;
        }
      }
      
      return { ...prev, orderItems: newItems };
    });
  };

  const calculateTotalCost = () => {
    const itemsCost = formData.orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    return itemsCost + formData.deliveryCost;
  };

  const handleInputChange = (field: keyof OrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Order' : 'Add New Order'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Order Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID *
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => handleInputChange('orderId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.orderId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ORD001"
                />
                {errors.orderId && <p className="mt-1 text-sm text-red-600">{errors.orderId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Date *
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => handleInputChange('orderDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email *
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer email"
                />
                {errors.customerEmail && <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter mobile number"
                />
                {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city name"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter pincode"
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </h2>
              <button
                type="button"
                onClick={addOrderItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>

            {errors.orderItems && <p className="mb-4 text-sm text-red-600">{errors.orderItems}</p>}

            {formData.orderItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu Item *
                    </label>
                    <select
                      value={item.itemId}
                      onChange={(e) => updateOrderItem(index, 'itemId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a menu item</option>
                      {menuItems.map((menuItem) => (
                        <option key={menuItem.id} value={menuItem.id}>
                          {menuItem.name} - ₹{menuItem.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      readOnly
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeOrderItem(index)}
                      className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    Total: ₹{item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Payment and Delivery */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment & Delivery
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deliveryCost}
                  onChange={(e) => handleInputChange('deliveryCost', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.deliveryCost ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.deliveryCost && <p className="mt-1 text-sm text-red-600">{errors.deliveryCost}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status *
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode of Payment *
                </label>
                <select
                  value={formData.modeOfPayment}
                  onChange={(e) => handleInputChange('modeOfPayment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Transaction/UPI reference"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Feedback
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Feedback
              </label>
              <textarea
                value={formData.feedback}
                onChange={(e) => handleInputChange('feedback', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter customer feedback or notes..."
              />
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Items Cost:</span>
                <span className="font-medium">
                  ₹{formData.orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Cost:</span>
                <span className="font-medium">₹{formData.deliveryCost.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Cost:</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{calculateTotalCost().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (isEditing ? 'Update Order' : 'Create Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditOrder; 