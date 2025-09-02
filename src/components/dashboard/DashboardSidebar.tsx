'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CubeIcon, 
  ChartBarIcon, 
  CogIcon, 
  UserGroupIcon,
  MapPinIcon,
  BellIcon,
  PlusIcon
} from '@/components/ui/Icons';
import { DashboardView } from '@/app/dashboard/page';

interface DashboardSidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  provider: any;
}

const navigationItems = [
  {
    id: 'overview',
    name: 'Overview',
    icon: HomeIcon,
    href: '/dashboard',
    description: 'Dashboard overview and quick actions'
  },
  {
    id: 'services',
    name: 'Services',
    icon: CubeIcon,
    href: '/dashboard/services',
    description: 'Manage your service catalog'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: ChartBarIcon,
    href: '/dashboard/analytics',
    description: 'View performance metrics'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: CogIcon,
    href: '/dashboard/settings',
    description: 'Account and business settings'
  }
];

export default function DashboardSidebar({ currentView, onViewChange, provider }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <div className="w-64 flex-shrink-0">
      {/* Provider Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-lg flex items-center justify-center">
            <CubeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{provider?.business_name || 'Business Name'}</h3>
            <p className="text-sm text-gray-500">Service Provider</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Services</span>
            <span className="font-medium text-gray-900">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active</span>
            <span className="font-medium text-green-600">8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Draft</span>
            <span className="font-medium text-yellow-600">4</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href) || 
                        (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              href={item.href}
              key={item.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white shadow-md'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                active ? 'text-white' : 'text-gray-400 group-hover:text-[#E76F51]'
              }`} />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className={`text-xs ${
                  active ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 px-4">Quick Actions</h3>
        <div className="space-y-2">
          <Link href="/dashboard/services/new" className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-[#E76F51]" />
              <span>New Service</span>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              New
            </span>
          </Link>
          
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 group">
            <UserGroupIcon className="w-4 h-4 text-gray-400 group-hover:text-[#E76F51]" />
            <span>Invite Staff</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 group">
            <MapPinIcon className="w-4 h-4 text-gray-400 group-hover:text-[#E76F51]" />
            <span>Add Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}
