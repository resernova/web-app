'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { PlusIcon, CalendarIcon } from '@/components/ui/Icons';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ServicesCatalog from '@/components/dashboard/ServicesCatalog';
import { CreateServiceWizard } from '@/components/dashboard/CreateServiceWizard';
import AddLocation from '@/components/dashboard/AddLocation';

export type DashboardView = 'add-location' | 'overview' | 'services' | 'create-service' | 'analytics' | 'settings';

export default function DashboardPage() {
  const { user, profile, provider, role, loading } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [showCreateService, setShowCreateService] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (role !== 'business') {
        router.push('/');
      }
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E76F51] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || role !== 'business') {
    return null;
  }

  const handleCreateService = () => {
    router.push('dashboard/services/new')
  };

  const handleAddLocation = () => {
    setCurrentView('add-location');
    setShowCreateService(true);
  };

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
    setShowCreateService(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <button
                onClick={handleCreateService}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white text-sm font-medium rounded-lg hover:from-[#D65A42] hover:to-[#E76F51] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Service
              </button>

              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <DashboardSidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            provider={provider}
          />

          {/* Main Content */}
          <div className="flex-1">
            {currentView === 'overview' && (
              <DashboardOverview
                provider={provider}
                onAddLocation={handleAddLocation}
                onCreateService={handleCreateService}
              />
            )}

            {currentView === 'services' && (
              <ServicesCatalog
                provider={provider}
                onCreateService={handleCreateService}
              />
            )}

            {/* {currentView === 'create-service' && (
              <CreateServiceWizard
                setShowCreateService={setCurrentView}
                onSuccess={() => {
                  // Handle successful service creation
                  console.log('Service created successfully!');
                }} />
            )} */}

            {currentView === 'add-location' && (
              <AddLocation
                setShowAddLocation={setCurrentView}
                onSuccess={() => {
                  console.log('location created successfully!');
                }} />
            )}

            {currentView === 'analytics' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </div>
            )}

            {currentView === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
