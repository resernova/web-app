'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PersonIcon, BuildingIcon } from '@/components/ui/Icons';

export default function TestAuthPage() {
  const { user, profile, provider, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E76F51] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Authentication Test Page</h1>
          
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-lg font-semibold text-green-800 mb-2">✅ User is Authenticated</h2>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {role || 'Unknown'}</p>
                  <p><strong>Email Verified:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {profile && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">👤 User Profile</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p><strong>Name:</strong> {profile.name || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {profile.phone_number || 'Not provided'}</p>
                    <p><strong>Created:</strong> {profile.created_at ? new Date(profile.created_at).toLocaleString() : 'Unknown'}</p>
                    <p><strong>Updated:</strong> {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Unknown'}</p>
                  </div>
                </div>
              )}

              {provider && role === 'business' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">🏢 Business Profile</h3>
                  <div className="space-y-2 text-sm text-purple-700">
                    <p><strong>Business Name:</strong> {provider.business_name}</p>
                    <p><strong>Contact Person:</strong> {provider.name}</p>
                    <p><strong>Description:</strong> {provider.description || 'Not provided'}</p>
                    <p><strong>Created:</strong> {provider.created_at ? new Date(provider.created_at).toLocaleString() : 'Unknown'}</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🔧 Debug Information</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Raw User Object:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-lg font-semibold text-red-800 mb-2">❌ User is NOT Authenticated</h2>
              <p className="text-red-700">Please log in to see your authentication information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
