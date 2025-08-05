import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Wheat, Leaf } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

interface MenuCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onView: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/menu/${item.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {item.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {item.name}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        
        {/* Dietary Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {item.isGlutenFree && (
            <div className="flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              <Wheat className="w-3 h-3 mr-1" />
              Gluten Free
            </div>
          )}
          {item.isSugarFree && (
            <div className="flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              <Leaf className="w-3 h-3 mr-1" />
              Sugar Free
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-primary-600">
            ₹{item.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleView}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          
          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 