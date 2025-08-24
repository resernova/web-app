'use client';

import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@/components/ui/Icons';

interface ServicesCatalogProps {
  provider: any;
  onCreateService: () => void;
}

interface Service {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  capacity: number;
  status: 'active' | 'inactive' | 'draft';
  rating: number;
  lastBooking: string;
  category: string;
  photos: string[];
}

export default function ServicesCatalog({ provider, onCreateService }: ServicesCatalogProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');

  // Mock data - replace with real data from your API
  const services: Service[] = [
    {
      id: '1',
      title: 'Luxury Spa Treatment',
      description: 'Relaxing spa treatment with premium products',
      location: 'Downtown Spa Center',
      price: 120,
      duration: 90,
      capacity: 1,
      status: 'active',
      rating: 4.8,
      lastBooking: '2024-01-15',
      category: 'Wellness',
      photos: ['/spa1.jpg', '/spa2.jpg']
    },
    {
      id: '2',
      title: 'City Tour Guide',
      description: 'Explore the city with our expert guides',
      location: 'City Center',
      price: 75,
      duration: 180,
      capacity: 15,
      status: 'active',
      rating: 4.9,
      lastBooking: '2024-01-14',
      category: 'Tours',
      photos: ['/tour1.jpg']
    },
    {
      id: '3',
      title: 'Cooking Class',
      description: 'Learn to cook traditional Moroccan dishes',
      location: 'Culinary Institute',
      price: 95,
      duration: 120,
      capacity: 8,
      status: 'draft',
      rating: 0,
      lastBooking: '',
      category: 'Culinary',
      photos: []
    },
    {
      id: '4',
      title: 'Yoga Session',
      description: 'Morning yoga for all levels',
      location: 'Wellness Studio',
      price: 45,
      duration: 60,
      capacity: 20,
      status: 'inactive',
      rating: 4.7,
      lastBooking: '2024-01-10',
      category: 'Wellness',
      photos: ['/yoga1.jpg']
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleEditService = (serviceId: string) => {
    // Handle edit service
    console.log('Edit service:', serviceId);
  };

  const handleDeleteService = (serviceId: string) => {
    // Handle delete service
    console.log('Delete service:', serviceId);
  };

  const handleToggleStatus = (serviceId: string, currentStatus: string) => {
    // Handle status toggle
    console.log('Toggle status for service:', serviceId, 'from', currentStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Catalog</h1>
          <p className="text-gray-600">Manage your service offerings and availability</p>
        </div>
        
        <button
          onClick={onCreateService}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white text-sm font-medium rounded-lg hover:from-[#D65A42] hover:to-[#F4A261] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Service
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E76F51] focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E76F51] focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#E76F51] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#E76F51] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Service Image */}
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                {service.photos.length > 0 ? (
                  <img 
                    src={service.photos[0]} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <CubeIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">No image</p>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{service.title}</h3>
                  {getStatusBadge(service.status)}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                {/* Service Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {service.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                    ${service.price}
                  </div>
                </div>

                {/* Rating and Last Booking */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{service.rating}</span>
                  </div>
                  {service.lastBooking && (
                    <span className="text-xs text-gray-500">
                      Last: {new Date(service.lastBooking).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditService(service.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-[#E76F51] border border-[#E76F51] rounded-lg hover:bg-[#E76F51] hover:text-white transition-colors"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(service.id, service.status)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      service.status === 'active'
                        ? 'text-red-600 border border-red-600 hover:bg-red-600 hover:text-white'
                        : 'text-green-600 border border-green-600 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    {service.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        <div className="text-sm text-gray-500">{service.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${service.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.duration} min</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(service.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">{service.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditService(service.id)}
                          className="text-[#E76F51] hover:text-[#D65A42]"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first service'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={onCreateService}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white text-sm font-medium rounded-lg hover:from-[#D65A42] hover:to-[#F4A261] transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Your First Service
            </button>
          )}
        </div>
      )}
    </div>
  );
}
