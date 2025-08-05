import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, DollarSign, Tag, ChefHat, Wheat, Leaf, Palette } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';
import { menuService } from '../services/menuService';

const MenuDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMenuItem(id);
    }
  }, [id]);

  const loadMenuItem = async (itemId: string) => {
    setLoading(true);
    try {
      const item = await menuService.getMenuItem(itemId);
      setMenuItem(item);
    } catch (error) {
      console.error('Error loading menu item:', error);
      alert('Failed to load menu item');
    } finally {
      setLoading(false);
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

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Item Not Found</h2>
          <p className="text-gray-600 mb-6">The menu item you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </button>
          <button
            onClick={() => navigate(`/add?id=${menuItem.id}`)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Item
          </button>
        </div>

        {/* Menu Item Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Image */}
          {menuItem.imageUrl && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={menuItem.imageUrl}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title and Price */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{menuItem.name}</h1>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">₹{menuItem.price.toFixed(2)}</div>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${
                  menuItem.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {menuItem.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center text-gray-600">
                <Tag className="w-5 h-5 mr-2" />
                <span className="font-medium">Category:</span>
                <span className="ml-2">{menuItem.category}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-medium">Added:</span>
                <span className="ml-2">{menuItem.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-5 h-5 mr-2" />
                <span className="font-medium">Price:</span>
                <span className="ml-2">₹{menuItem.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Dietary Information */}
            <div className="flex flex-wrap gap-3 mb-8">
              {menuItem.isGlutenFree && (
                <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  <Wheat className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Gluten Free</span>
                </div>
              )}
              {menuItem.isSugarFree && (
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  <Leaf className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Sugar Free</span>
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ChefHat className="w-5 h-5 mr-2" />
                Ingredients
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{menuItem.ingredients}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cooking Instructions</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{menuItem.instructions}</p>
              </div>
            </div>

            {/* Presentation */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                How to Present
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{menuItem.presentation}</p>
              </div>
            </div>

            {/* Shelf Life */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Shelf Life
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{menuItem.shelfLife}</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-sm text-gray-500 text-center pt-6 border-t">
              Last updated: {menuItem.updatedAt.toLocaleDateString()} at {menuItem.updatedAt.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail; 