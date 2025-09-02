'use client';

import React from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@/components/ui/Icons';

interface DashboardOverviewProps {
  provider: any;
  onCreateService: () => void;
  onAddLocation: () => void;
}

export default function DashboardOverview({ provider, onCreateService, onAddLocation }: DashboardOverviewProps) {
  // Mock data - replace with real data from your API
  const stats = {
    todayBookings: 8,
    upcomingBookings: 23,
    pendingRequests: 5,
    revenueMTD: 2840,
    liveServices: 8
  };

  const alerts = [
    {
      type: 'warning',
      message: '3 pending booking confirmations',
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      type: 'info',
      message: '2 new service requests',
      icon: CheckCircleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      type: 'error',
      message: '1 cancellation request',
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const quickActions = [
    {
      title: 'Create Service',
      description: 'Add a new service to your catalog',
      icon: CubeIcon,
      action: onCreateService,
      color: 'from-[#E76F51] to-[#F4A261]'
    },
    {
      title: 'Add Location',
      description: 'Set up a new service location',
      icon: CalendarIcon,
      action: onAddLocation,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Invite Staff',
      description: 'Invite team members to help',
      icon: ClockIcon,
      action: () => { },
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Open Calendar',
      description: 'View and manage bookings',
      icon: CalendarIcon,
      action: () => { },
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#E76F51] to-[#F4A261] rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {provider?.name || 'Provider'}!
        </h1>
        <p className="text-white/90">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming (7d)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue (MTD)</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenueMTD}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Live Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.liveServices}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${alert.borderColor} ${alert.bgColor} flex items-center space-x-3`}
                >
                  <Icon className={`w-5 h-5 ${alert.color}`} />
                  <span className={`text-sm font-medium ${alert.color}`}>
                    {alert.message}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-[#E76F51] hover:text-[#D65A42] font-medium">
              View all notifications →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New booking received for "Luxury Spa Treatment"</span>
            <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Service "City Tour Guide" published successfully</span>
            <span className="text-xs text-gray-400 ml-auto">15 min ago</span>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Payment received for booking #12345</span>
            <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
