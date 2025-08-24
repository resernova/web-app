'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugAuth() {
  const { user, profile, provider, role, loading } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.email : 'None'}</p>
        <p><strong>Profile:</strong> {profile ? 'Exists' : 'None'}</p>
        <p><strong>Provider:</strong> {provider ? 'Exists' : 'None'}</p>
        <p><strong>Role:</strong> {role || 'None'}</p>
        <p><strong>Path:</strong> {window.location.pathname}</p>
      </div>
    </div>
  );
}
