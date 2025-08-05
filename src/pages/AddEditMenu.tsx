import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, ChefHat, BookOpen, Palette, Clock, Package } from 'lucide-react';
import { MenuFormData } from '../types/MenuItem';
import { menuService } from '../services/menuService';

const AddEditMenu: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    price: 0,
    category: '',
    imageUrl: '',
    isAvailable: true,
    ingredients: '',
    instructions: '',
    presentation: '',
    shelfLife: '',
    packaging: '',
    isGlutenFree: false,
    isSugarFree: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editId) {
      loadMenuItem(editId);
    }
  }, [editId]);

  const loadMenuItem = async (id: string) => {
    setLoading(true);
    try {
      const item = await menuService.getMenuItem(id);
      if (item) {
        setFormData({
          name: item.name,
          price: item.price,
          category: item.category,
          imageUrl: item.imageUrl || '',
          isAvailable: item.isAvailable,
          ingredients: item.ingredients || '',
          instructions: item.instructions || '',
          presentation: item.presentation || '',
          shelfLife: item.shelfLife || '',
          packaging: item.packaging || '',
          isGlutenFree: item.isGlutenFree || false,
          isSugarFree: item.isSugarFree || false,
        });
      }
    } catch (error) {
      console.error('Error loading menu item:', error);
      alert('Failed to load menu item');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Cooking instructions are required';
    }

    if (!formData.presentation.trim()) {
      newErrors.presentation = 'Presentation instructions are required';
    }

    if (!formData.shelfLife.trim()) {
      newErrors.shelfLife = 'Shelf life information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        await menuService.updateMenuItem(editId, formData);
      } else {
        await menuService.addMenuItem(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof MenuFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Menu
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {editId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter item name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Appetizer, Main Course, Dessert"
                />
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ChefHat className="w-4 h-4 mr-2" />
                Ingredients *
              </label>
              <textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.ingredients ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="List all ingredients needed for this dish..."
              />
              {errors.ingredients && <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>}
            </div>

            {/* Instructions */}
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Cooking Instructions *
              </label>
              <textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.instructions ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Step-by-step cooking instructions..."
              />
              {errors.instructions && <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>}
            </div>

            {/* Presentation */}
            <div>
              <label htmlFor="presentation" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                How to Present *
              </label>
              <textarea
                id="presentation"
                value={formData.presentation}
                onChange={(e) => handleInputChange('presentation', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.presentation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="How should this dish be presented to customers? (plating, garnishes, etc.)"
              />
              {errors.presentation && <p className="mt-1 text-sm text-red-600">{errors.presentation}</p>}
            </div>

            {/* Shelf Life */}
            <div>
              <label htmlFor="shelfLife" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Shelf Life *
              </label>
              <textarea
                id="shelfLife"
                value={formData.shelfLife}
                onChange={(e) => handleInputChange('shelfLife', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.shelfLife ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="How long can this dish be stored? (e.g., 2 hours at room temperature, 3 days refrigerated, etc.)"
              />
              {errors.shelfLife && <p className="mt-1 text-sm text-red-600">{errors.shelfLife}</p>}
            </div>

            {/* Packaging */}
            <div>
              <label htmlFor="packaging" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Packaging
              </label>
              <textarea
                id="packaging"
                value={formData.packaging}
                onChange={(e) => handleInputChange('packaging', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="How should this dish be packaged for delivery or takeaway? (e.g., eco-friendly containers, specific packaging materials, etc.)"
              />
              <p className="mt-1 text-sm text-gray-500">Optional: Add packaging instructions for delivery or takeaway</p>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Optional: Add an image URL for the menu item</p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available for ordering</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isGlutenFree}
                    onChange={(e) => handleInputChange('isGlutenFree', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Gluten Free</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isSugarFree}
                    onChange={(e) => handleInputChange('isSugarFree', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sugar Free</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            {formData.imageUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditMenu; 